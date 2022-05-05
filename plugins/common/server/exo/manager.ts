import fs from 'fs'
import path from 'path'

import { Context } from '../context'

import type { ExoMeta } from '@/types/exos'

export namespace EXOManager {
    export const exos: ExoMeta[] = []

    const FILE_PATH = path.join(Context.dataFolder, 'exos', 'data.json')

    const save = () => {
        return fs.promises.writeFile(FILE_PATH, JSON.stringify(exos, null, 4))
    }
    const load = async () => {
        exos.length = 0
        if (!fs.existsSync(path.dirname(FILE_PATH)))
            await fs.promises.mkdir(path.dirname(FILE_PATH))
        if (!fs.existsSync(FILE_PATH)) fs.promises.writeFile(FILE_PATH, '[]')
        const data = JSON.parse(await fs.promises.readFile(FILE_PATH, 'utf-8'))
        exos.push(...data)
    }
    export const get = (id: string) => {
        return exos.find((exo) => exo.id === id)
    }
    export const exists = (id: string) => {
        return !!get(id)
    }
    export const add = (exo: ExoMeta) => {
        if (exists(exo.id)) throw new Error(`Exo ${exo.id} already exists`)
        exos.push(exo)
        save()
    }
    export const remove = (id: string) => {
        const index = exos.findIndex((exo) => exo.id === id)
        if (index === -1) throw new Error(`Exo ${id} does not exist`)
        exos.splice(index, 1)
        save()
    }
    export const update = (id: string, exo: ExoMeta) => {
        const index = exos.findIndex((exo) => id === exo.id)
        if (index === -1) throw new Error(`Exo ${exo.id} does not exist`)
        exos[index] = exo
        save()
    }
    load()
}
