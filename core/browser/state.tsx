import type { FutureContextType, PluginMeta } from '@aviutil-toys/api/client'
import { atom } from 'jotai'

export const pluginsAtom = atom<
  {
    meta: Record<string, any>
    context: PluginMeta
  }[]
>([])
export const futuresAtom = atom<FutureContextType[]>([])
