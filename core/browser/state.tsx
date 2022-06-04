import type { ToyContextType, PluginMeta } from '@aviutl-toys/api/client'
import { atom } from 'jotai'

export const pluginsAtom = atom<
  {
    meta: Record<string, any>
    context: PluginMeta
  }[]
>([])
export const toysAtom = atom<ToyContextType[]>([])
