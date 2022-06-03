import { EXO, ItemFooter, ItemHeader, ItemObject } from '@aviutil/exo'
import fs from 'fs'
import { getAudioDurationInSeconds } from 'get-audio-duration'
import iconv from 'iconv-lite'
import path from 'path'
import { ReadOptions, SofTalk } from 'softalk'

import { Context } from '.'

import type { VoicePreset, Configuration } from '@/types'

class VoiceManager {
    private softalk: SofTalk | undefined

    public enabled = false
    public readonly presets: VoicePreset[] = []

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

    public async createVoice(
        text: string,
        fps: number,
        readOptions: ReadOptions,
        subTitle?: string,
    ) {
        const filename = text.replace(/\\|\/|:|\*|\?|<|>|\|/, '-') + new Date().getTime() + '.wav'
        const out = path.join(Context.dataFolder, 'voices', filename)
        if (!fs.existsSync(path.dirname(out)))
            await fs.promises.mkdir(path.dirname(out), { recursive: true })
        await this.softalk?.save(text, out, readOptions)

        const duration = await getAudioDurationInSeconds(out)

        const exo = EXO.create({
            exedit: {
                width: 1920,
                height: 1080,
                rate: fps,
                scale: 1,
                length: 77,
                audio_rate: 44100,
                audio_ch: 2,
            },
            items: [
                {
                    '0': {
                        start: 1,
                        end: duration * fps,
                        layer: 1,
                        group: 1,
                        overlay: 1,
                        audio: 1,
                    },
                    '0.0': {
                        _name: '音声ファイル',
                        再生位置: 0.0,
                        再生速度: 100.0,
                        ループ再生: 0,
                        動画ファイルと連携: 0,
                        file: out,
                    },
                    '0.1': {
                        _name: '標準再生',
                        音量: 100.0,
                        左右: 0.0,
                    },
                },
            ],
        })

        if (subTitle) {
            const textExo = this.getSubTitleExo(subTitle)
            const header = textExo.shift() as ItemHeader
            const footer = textExo.pop() as ItemFooter
            header.end = duration * fps
            header.layer = 2
            header.group = 1
            for (const item of textExo.filter((e) => Object.keys(e).includes('text'))) {
                const utf16Array: string[] = []
                for (const s of text)
                    utf16Array.push(iconv.encode(s, 'utf16le').toString('hex').padEnd(4, '0'))
                item['text'] = utf16Array.join('').padEnd(4096, '0')
            }
            exo.pushItem({
                header,
                objects: textExo,
                footer,
            })
        }

        await fs.promises.writeFile(`${out}.exo`, iconv.encode(exo.toString(), 'shift_jis'))
        return `${out}.exo`
    }
    public async playVoice(text: string, readOptions: ReadOptions) {
        this.softalk?.readSync(text, readOptions)
    }

    public getSubTitleExo(str: string): ItemObject[] {
        const exo = EXO.parse(str)
        const textIndex = exo.items.findIndex((item, i) => item[`${i}.0`]?._name === 'テキスト')
        if (textIndex === -1) throw new Error('Subtitle file does not contain text')
        return Object.values(exo.items[textIndex]!)
    }
}

export const voiceManager = new VoiceManager()
