import fs from 'fs'
import path from 'path'

import { Context } from '../context'

import type { ExoMeta } from '@/types/exos'

class ExoManagerClass {
    private readonly FILE_PATH = path.join(Context.dataFolder, 'exos', 'data.json')

    public readonly exos: ExoMeta[] = []

    constructor() {
        this.load()
    }

    private save = () => {
        return fs.promises.writeFile(this.FILE_PATH, JSON.stringify(this.exos, null, 4))
    }
    private load = async () => {
        this.exos.length = 0
        if (!fs.existsSync(path.dirname(this.FILE_PATH)))
            await fs.promises.mkdir(path.dirname(this.FILE_PATH))
        if (!fs.existsSync(this.FILE_PATH)) fs.promises.writeFile(this.FILE_PATH, '[]')
        const data = JSON.parse(await fs.promises.readFile(this.FILE_PATH, 'utf-8'))
        this.exos.push(...data)
    }
    public get = (id: string) => {
        return this.exos.find((exo) => exo.id === id)
    }
    public exists = (id: string) => {
        return !!this.get(id)
    }
    public add = (exo: ExoMeta) => {
        if (this.exists(exo.id)) throw new Error(`Exo ${exo.id} already exists`)
        this.exos.push(exo)
        this.save()
    }
    public remove = (id: string) => {
        const index = this.exos.findIndex((exo) => exo.id === id)
        if (index === -1) throw new Error(`Exo ${id} does not exist`)
        this.exos.splice(index, 1)
        this.save()
    }
    public update = (id: string, exo: ExoMeta) => {
        const index = this.exos.findIndex((exo) => id === exo.id)
        if (index === -1) throw new Error(`Exo ${exo.id} does not exist`)
        this.exos[index] = exo
        this.save()
    }
}

export const ExoManager = new ExoManagerClass()
