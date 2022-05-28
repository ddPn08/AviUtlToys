import fs from 'fs'
import path from 'path'
import { ReadOptions, SofTalk } from 'softalk'

import { Context } from '.'

import type { VoicePreset, Configuration } from '@/types'

class VoiceManager {
    public enabled = false
    public readonly presets: VoicePreset[] = []
    private softalk: SofTalk | undefined

    constructor() {
        this.init()
    }

    private async init() {
        const config = await this.getConfig()
        if (config.presets) this.presets.push(...config.presets)
        if (!fs.existsSync(path.join(Context.dataFolder, 'softalk', 'softalk.exe'))) return
        this.softalk = new SofTalk(path.join(Context.dataFolder, 'softalk', 'softalk.exe'))
        this.enabled = true
    }

    private async getConfig(): Promise<Configuration> {
        const filepath = path.join(Context.dataFolder, 'config.json')
        if (!fs.existsSync(filepath))
            await fs.promises.writeFile(
                filepath,
                JSON.stringify({
                    presets: [],
                }),
            )
        const config = JSON.parse(await fs.promises.readFile(filepath, 'utf8'))
        return config
    }
    private async saveConfig() {
        const filepath = path.join(Context.dataFolder, 'config.json')
        const config: Configuration = {
            presets: this.presets,
        }
        await fs.promises.writeFile(filepath, JSON.stringify(config))
    }

    public getPreset(name: string) {
        return this.presets.find((o) => o.name === name)
    }
    public async addPreset(option: VoicePreset) {
        const previous = this.presets.findIndex((o) => o.name === option.name)
        if (previous !== -1) this.presets.splice(previous, 1)
        this.presets.push(option)
        await this.saveConfig()
    }
    public async removePreset(name: string) {
        const index = this.presets.findIndex((o) => o.name === name)
        if (index === -1) throw new Error(`Voice option with id ${name} not found`)
        this.presets.splice(index, 1)
        await this.saveConfig()
    }

    public async createVoice(text: string, readOptions: ReadOptions) {
        const filename = text.replace(/\\|\/|:|\*|\?|<|>|\|/, '-') + new Date().getTime() + '.wav'
        const out = path.join(Context.dataFolder, 'voices', filename)
        if (!fs.existsSync(path.dirname(out)))
            await fs.promises.mkdir(path.dirname(out), { recursive: true })
        await this.softalk?.save(text, out, readOptions)
        return out
    }
    public async playVoice(text: string, readOptions: ReadOptions) {
        this.softalk?.readSync(text, readOptions)
    }
}

export const voiceManager = new VoiceManager()
