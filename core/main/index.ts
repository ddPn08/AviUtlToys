import './__setup'
import { Configuration } from '@aviutil-toys/api/server'
import { app, BrowserWindow } from 'electron'
import path from 'path'

import { PluginLoader } from './plugin-loader'

export const isDev = process.env['NODE_ENV'] === 'development'

app.once('ready', async () => {
    await import('./ipc/api')
    await import('./ipc/system')
    await Configuration.load()
    await loadPLugins()
    await createWindow()
})

const createWindow = async () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 960,
        minHeight: 720,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#ffffff',
    })

    window.loadURL(`file://${path.join(__dirname, 'client', 'index.html')}#/toys/settings`)
    if (isDev) window.webContents.openDevTools()
}

const loadPLugins = async () => {
    const pluginDirs = [path.join(app.getPath('userData'), 'plugins')]

    if (isDev) pluginDirs.push(path.join(__dirname, '../../plugins'))
    else pluginDirs.push(path.join(__dirname, 'plugins'))

    for (const dir of pluginDirs) {
        await PluginLoader.loadPlugins(dir)
    }
    await PluginLoader.importPlugins()
}
