import { atomWithStorage } from 'jotai/utils'

import type { VoicePreset } from '@/types'

export const lastPresetAtom = atomWithStorage<VoicePreset | undefined>('lastPreset', undefined)
