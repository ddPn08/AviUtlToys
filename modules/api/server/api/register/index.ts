import { BrowserWindow, dialog, shell } from 'electron'

import type { ClientToServerEvents, ServerToClientEvents } from '../../../root'
import { Configuration } from '../../configuration'
import { ApiServer } from '../server'

export const api = new ApiServer<ServerToClientEvents, ClientToServerEvents>('api')

export const registerApi = () => {
    api.handle('window:close', () => {
        const window = BrowserWindow.getFocusedWindow()
        window?.close()
    })
    api.handle('window:toggleMaximize', () => {
        const window = BrowserWindow.getFocusedWindow()
        window?.isMaximized() ? window?.unmaximize() : window?.maximize()
    })
    api.handle('window:minimize', () => {
        const window = BrowserWindow.getFocusedWindow()
        window?.minimize()
    })

    api.handle('shell:open-external', (_, url) => {
        shell.openExternal(url)
    })
    api.handle('native:show-open-dialog', (_, options) => {
        return dialog.showOpenDialog({
            ...options,
        })
    })
    api.handle('native:drag-file', (e, file, icon) => {
        e.sender.startDrag({
            file,
            icon: icon || require.resolve('@aviutil-toys/assets/image/drag-and-drop.png'),
        })
    })

    api.handle('config:get', () => {
        return Configuration.get()
    })
    api.handle('config:update', (_, newConfig) => {
        Configuration.save(newConfig)
    })
}
