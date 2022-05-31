import type { ClientToServerEvents, ServerToClientEvents } from '@aviutil-toys/api'
import { Configuration, ApiServer } from '@aviutil-toys/api/server'
import { BrowserWindow, dialog, shell } from 'electron'

export const ipcApi = new ApiServer<ServerToClientEvents, ClientToServerEvents>('api')

ipcApi.handle('window:close', () => {
    const window = BrowserWindow.getFocusedWindow()
    window?.close()
})
ipcApi.handle('window:toggleMaximize', () => {
    const window = BrowserWindow.getFocusedWindow()
    window?.isMaximized() ? window?.unmaximize() : window?.maximize()
})
ipcApi.handle('window:minimize', () => {
    const window = BrowserWindow.getFocusedWindow()
    window?.minimize()
})

ipcApi.handle('shell:open-external', (_, url) => {
    shell.openExternal(url)
})
ipcApi.handle('native:show-open-dialog', (_, options) => {
    return dialog.showOpenDialog({
        ...options,
    })
})
ipcApi.handle('native:drag-file', (e, file, icon) => {
    e.sender.startDrag({
        file,
        icon: icon || require.resolve('@aviutil-toys/assets/image/drag-and-drop.png'),
    })
})

ipcApi.handle('config:get', () => {
    return Configuration.get()
})
ipcApi.handle('config:update', async (_, newConfig) => {
    await Configuration.save(newConfig)
    ipcApi.emit('config:update', newConfig)
})
