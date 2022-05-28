import { ApiServer } from '@aviutil-toys/api/server'

import { voiceManager } from './voice-manager'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const api = new ApiServer<ServerToClientEvents, ClientToServerEvents>(
    'system:plugin:softalk',
)

api.handle('enabled', () => voiceManager.enabled)
api.handle('voice:craete', (_, id, readOptions) => voiceManager.createVoice(id, readOptions))
api.handle('voice:play', (_, id, readOptions) => voiceManager.playVoice(id, readOptions))

api.handle('voice:preset:list', () => voiceManager.presets)
api.handle('voice:preset:create', (_, option) => voiceManager.addPreset(option))
api.handle('voice:preset:delete', (_, id) => {
    const old = voiceManager.getPreset(id)
    if (!old) throw new Error(`Voice option with id ${id} not found`)
    voiceManager.removePreset(id)
})