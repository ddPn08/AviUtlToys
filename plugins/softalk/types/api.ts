import type { ReadOptions } from 'softalk'

import type { VoicePreset } from './softalk'

export interface ServerToClientEvents {}
export interface ClientToServerEvents {
    enabled: () => boolean
    'voice:craete': (text: string, readOptions: ReadOptions) => string
    'voice:play': (text: string, readOptions: ReadOptions) => void
    'voice:preset:list': () => VoicePreset[]
    'voice:preset:create': (option: VoicePreset) => void
    'voice:preset:delete': (id: string) => void
}
