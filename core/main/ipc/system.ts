import { ApiServer } from '@aviutil-toys/api/server'

import { PluginLoader } from '../plugin-loader'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipcSystem = new ApiServer<ServerToClientEvents, ClientToServerEvents>('system')

ipcSystem.handle('plugin:list', () => {
    return PluginLoader.pluginMetas.map((v) => ({
        meta: v.meta,
        entry: v.entry.client,
    }))
})
