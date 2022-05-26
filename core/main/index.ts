import './__setup'
import { Configuration } from '@aviutil-toys/api/server'
import { app, BrowserWindow } from 'electron'
import path from 'path'

import { buildClient } from './builder/esbuild'
import { PluginLoader } from './plugin-loader'

export const isDev = process.env['NODE_ENV'] === 'development'

app.once('ready', async () => {
    await import('./ipc/api')
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

    const outdir = await buildClient(window)
    window.loadURL(`file://${path.join(outdir, 'index.html')}#/futures/settings`)
    if (isDev) window.webContents.openDevTools()
}

const loadPLugins = async () => {
    const pluginDirs = [path.join(app.getPath('userData'), 'plugins')]
    if (isDev) pluginDirs.push(path.join(__dirname, '../..', 'plugins'))
    else pluginDirs.push(path.join(__dirname, 'plugins').replace('app.asar', 'app.asar.unpacked'))

    for (const dir of pluginDirs) {
        await PluginLoader.loadPlugins(dir)
    }
    await PluginLoader.importPlugins()
}
