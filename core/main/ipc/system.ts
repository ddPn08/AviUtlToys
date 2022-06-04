import { IpcServer, Configuration } from '@aviutl-toys/api/server'
import { spawn } from 'child_process'
import fs from 'fs'

import { PluginLoader } from '../plugin-loader'
import { update } from '../updater'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipcSystem = new IpcServer<ServerToClientEvents, ClientToServerEvents>('system')

ipcSystem.handle('plugin:list', () => {
    return PluginLoader.pluginMetaList
})
ipcSystem.handle('aviutl:run', () => {
    const config = Configuration.get()
    if (!config.aviutlExec) throw new Error('AviUtlの実行ファイルが設定されていません。')
    if (!fs.existsSync(config.aviutlExec)) throw new Error('AviUtlの実行ファイルが存在しません。')
    spawn(config.aviutlExec, { detached: true })
})
ipcSystem.handle('update:check', update)
