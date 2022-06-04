import { Configuration } from '@aviutil-toys/api/server'
import fs from 'fs'
import path from 'path'

import { Context } from '../context'

import type { AviutilFileSet } from '@/types/files'

class FileManagerClass {
    public readonly filesList: AviutilFileSet[] = []

    constructor() {
        this.load()
    }

    private checkFields() {
        for (const fileSet of this.filesList) {
            if (!fileSet.categories) fileSet.categories = []
        }
        this.save()
    }

    private async migrate() {
        const oldDataPath = path.join(Context.dataFolder, 'files', 'data.json')
        if (fs.existsSync(oldDataPath)) {
            const aviutilDir = this.getAviUtilDir()
            if (!aviutilDir) return
            await fs.promises.copyFile(oldDataPath, path.join(aviutilDir, '.auts', 'data.json'))
            await fs.promises.rm(oldDataPath)
        }
    }

    private save() {
        this.filesList.sort((a, b) => a.id.localeCompare(b.id, undefined, { sensitivity: 'base' }))
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return
        return fs.promises.writeFile(
            path.join(aviutilDir, '.auts', 'data.json'),
            JSON.stringify(this.filesList),
        )
    }

    private getAviUtilDir() {
        const config = Configuration.get()
        if (!config.aviutilDir) return
        return config.aviutilDir
    }

    public async load() {
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return

        this.filesList.length = 0
        const dataPath = path.join(aviutilDir, '.auts', 'data.json')
        await this.migrate()
        if (!fs.existsSync(path.dirname(dataPath))) await fs.promises.mkdir(path.dirname(dataPath))
        if (!fs.existsSync(dataPath)) await fs.promises.writeFile(dataPath, '[]')
        const data = JSON.parse(await fs.promises.readFile(dataPath, 'utf-8'))
        this.filesList.push(...data)
        this.checkFields()
    }
    public async update(id: string, file: AviutilFileSet) {
        await this.delete(id)
        await this.add(file)
    }

    public async add(file: AviutilFileSet) {
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return

        file.enabled = true
        file.categories.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        this.filesList.push(file)
        for (const { origin, dir, filename, type } of file.files) {
            if (!origin) throw new Error(`File ${file.id} is not valid (origin is not set)`)

            const dest = path.join(aviutilDir, dir, filename)
            if (dest === origin) continue
            if (!fs.existsSync(path.dirname(dest)))
                await fs.promises.mkdir(path.dirname(dest), { recursive: true })
            if (fs.existsSync(dest))
                throw new Error(`File ${file.id} is not valid (file ${filename} already exists)`)

            await fs.promises.cp(origin, dest, { recursive: type === 'dir' })
        }
        this.save()
    }

    public async delete(id: string) {
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return

        const file = this.filesList.find((file) => file.id === id)
        if (!file) throw new Error(`File ${id} does not exist`)

        this.filesList.splice(
            this.filesList.findIndex((file) => file.id === id),
            1,
        )
        for (const { dir, filename, type } of file.files) {
            if (!fs.existsSync(path.join(aviutilDir, dir, filename))) continue
            await fs.promises.rm(path.join(aviutilDir, dir, filename), {
                recursive: type === 'dir',
            })
        }
        this.save()
    }

    public get(id: string) {
        const file = this.filesList.find((file) => file.id === id)
        if (!file) throw new Error(`File ${id} does not exist`)
        return file
    }

    public exists(id: string) {
        return this.filesList.some((file) => file.id === id)
    }

    public async disable(id: string) {
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return

        const file = this.get(id)
        if (!file) throw new Error(`File ${id} does not exist`)
        if (!file.enabled) throw new Error(`File ${id} is already disabled`)

        file.enabled = false
        const disabledDir = path.join(aviutilDir, '.auts', 'disabled')
        if (!fs.existsSync(disabledDir)) await fs.promises.mkdir(disabledDir)
        for (const { dir, filename } of file.files) {
            const dest = path.join(disabledDir, dir, filename)
            if (!fs.existsSync(path.dirname(dest)))
                await fs.promises.mkdir(path.dirname(dest), { recursive: true })
            if (fs.existsSync(dest)) throw new Error(`File ${dest} already exists`)
            await fs.promises.rename(path.join(aviutilDir, dir, filename), dest)
        }
        this.save()
    }

    public async enable(id: string) {
        const aviutilDir = this.getAviUtilDir()
        if (!aviutilDir) return

        const file = this.get(id)
        if (!file) throw new Error(`File ${id} does not exist`)
        if (file.enabled) throw new Error(`File ${id} is already enabled`)

        file.enabled = true
        const disabledDir = path.join(aviutilDir, '.auts', 'disabled')
        if (!fs.existsSync(disabledDir)) throw new Error(`Disabled directory does not exist`)
        for (const { dir, filename } of file.files) {
            const src = path.join(disabledDir, dir, filename)
            await fs.promises.rename(src, path.join(aviutilDir, dir, filename))
        }
        this.save()
    }
}

export const FileManager = new FileManagerClass()
