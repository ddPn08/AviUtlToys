import { Configuration } from '@aviutil-toys/api/server'
import fs from 'fs'
import path from 'path'

import { Context } from '../context'

import type { AviutilFileSet } from '@/types/files'

export namespace FileManager {
    export const filesList: AviutilFileSet[] = []
    const FILE_PATH = path.join(Context.dataFolder, 'files', 'data.json')

    const save = () => {
        return fs.promises.writeFile(FILE_PATH, JSON.stringify(filesList, null, 4))
    }
    const load = async () => {
        filesList.length = 0
        if (!fs.existsSync(path.dirname(FILE_PATH)))
            await fs.promises.mkdir(path.dirname(FILE_PATH))
        if (!fs.existsSync(FILE_PATH)) fs.promises.writeFile(FILE_PATH, '[]')
        if (!fs.existsSync(path.join(aviutilDir(), '.auts')))
            await fs.promises.mkdir(path.join(aviutilDir(), '.auts'))
        const data = JSON.parse(await fs.promises.readFile(FILE_PATH, 'utf-8'))
        filesList.push(...data)
    }
    const aviutilDir = () => {
        const config = Configuration.get()
        if (!config.aviutilDir) throw new Error('aviutilDir is not set')
        return config.aviutilDir
    }
    load()

    export const add = async (file: AviutilFileSet) => {
        file.enabled = true
        filesList.push(file)
        for (const { origin, dir, filename } of file.files) {
            if (!origin) throw new Error(`File ${file.id} is not valid (origin is not set)`)

            const dest = path.join(aviutilDir(), dir, filename)
            if (dest === origin) continue
            if (!fs.existsSync(path.dirname(dest)))
                await fs.promises.mkdir(path.dirname(dest), { recursive: true })
            if (fs.existsSync(dest))
                throw new Error(`File ${file.id} is not valid (file ${filename} already exists)`)

            await fs.promises.copyFile(origin, dest)
        }
        save()
    }
    export const remove = async (id: string) => {
        const file = filesList.find((file) => file.id === id)
        if (!file) throw new Error(`File ${id} does not exist`)

        filesList.splice(
            filesList.findIndex((file) => file.id === id),
            1,
        )
        for (const { dir, filename } of file.files) {
            if (!fs.existsSync(path.join(aviutilDir(), dir, filename))) continue
            await fs.promises.unlink(path.join(aviutilDir(), dir, filename))
        }
        save()
    }
    export const update = (id: string, file: AviutilFileSet) => {
        remove(id)
        add(file)
    }
    export const get = (id: string) => {
        return filesList.find((file) => file.id === id)
    }
    export const exists = (id: string) => {
        return !!get(id)
    }
    export const disable = async (id: string) => {
        const file = get(id)
        if (!file) throw new Error(`File ${id} does not exist`)
        if (!file.enabled) throw new Error(`File ${id} is already disabled`)

        file.enabled = false
        const disabledDir = path.join(aviutilDir(), '.auts', 'disabled')
        if (!fs.existsSync(disabledDir)) await fs.promises.mkdir(disabledDir)
        for (const { dir, filename } of file.files) {
            const dest = path.join(disabledDir, dir, filename)
            if (!fs.existsSync(path.dirname(dest)))
                await fs.promises.mkdir(path.dirname(dest), { recursive: true })
            if (fs.existsSync(dest)) throw new Error(`File ${dest} already exists`)
            await fs.promises.rename(path.join(aviutilDir(), dir, filename), dest)
        }
        save()
    }
    export const enable = async (id: string) => {
        const file = get(id)
        if (!file) throw new Error(`File ${id} does not exist`)
        if (file.enabled) throw new Error(`File ${id} is already enabled`)

        file.enabled = true
        const disabledDir = path.join(aviutilDir(), '.auts', 'disabled')
        if (!fs.existsSync(disabledDir)) throw new Error(`Disabled directory does not exist`)
        for (const { dir, filename } of file.files) {
            const src = path.join(disabledDir, dir, filename)
            await fs.promises.rename(src, path.join(aviutilDir(), dir, filename))
        }
        save()
    }
}
