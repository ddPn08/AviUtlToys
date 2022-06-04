import type { ReadOptions } from 'softalk'

import type { VoicePreset } from './softalk'

export interface ServerToClientEvents {}
export interface ClientToServerEvents {
    enabled: () => boolean
    'voice:craete': (
        pronunciation: string,
        subTitleText: string,
        fps: number,
        readOptions: ReadOptions,
        subTitle?: string,
        exoVolume?: number,
    ) => string
    'voice:play': (text: string, readOptions: ReadOptions) => void
    'voice:preset:list': () => VoicePreset[]
    'voice:preset:create': (option: VoicePreset) => void
    'voice:preset:delete': (id: string) => void
}
