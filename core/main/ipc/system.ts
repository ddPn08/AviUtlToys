import { ApiServer, Configuration } from '@aviutil-toys/api/server'
import { spawn } from 'child_process'
import fs from 'fs'

import { PluginLoader } from '../plugin-loader'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipcSystem = new ApiServer<ServerToClientEvents, ClientToServerEvents>('system')

ipcSystem.handle('plugin:list', () => {
    return PluginLoader.pluginMetas.map((v) => ({
        meta: v.meta,
        entry: v.entry.client,
    }))
})
ipcSystem.handle('aviutil:run', () => {
    const config = Configuration.get()
    if (!config.aviutilExec) throw new Error('Aviutilの実行ファイルが設定されていません。')
    if (!fs.existsSync(config.aviutilExec)) throw new Error('Aviutilの実行ファイルが存在しません。')
    spawn(config.aviutilExec, { detached: true })
})
