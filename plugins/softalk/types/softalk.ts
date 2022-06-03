import type { ReadOptions } from 'softalk'

export type VoicePreset = {
    name: string
    readOptions: ReadOptions
    subTitle: string | undefined
}

export const VoiceNumberMap = {
    0: '女性01',
    1: '女性02',
    2: '男性01',
    3: '男性02',
    4: 'ロボット',
    5: '中性',
    6: '機械',
    7: '特殊',
}
