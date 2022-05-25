import { FutureContextType, PluginMeta } from '@aviutil-toys/api/client'
import { atom } from 'jotai'

export const pluginsAtom = atom<PluginMeta[]>([])
export const futuresAtom = atom<FutureContextType[]>([])
