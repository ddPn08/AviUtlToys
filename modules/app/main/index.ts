import './__setup'
import './_setup'
import { registerApi } from '@aviutil-toys/api/server'
import { app, BrowserWindow } from 'electron'
import path from 'path'

import { buildClient } from './builder/esbuild'
import { PluginLoader } from './plugin-loader'

export const isDev = process.env['NODE_ENV'] === 'development'

app.once('ready', async () => {
    await loadPLugins()
    await createWindow()
    registerApi()
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
    const plugnsDirs = [path.join(app.getPath('userData'), 'plugins')]
    if (isDev) plugnsDirs.push(path.join(__dirname, '../../..', 'plugins'))
    else plugnsDirs.push(path.join(__dirname, 'plugins').replace('app.asar', 'app.asar.unpacked'))

    for (const dir of plugnsDirs) {
        await PluginLoader.loadPlugins(dir)
    }
    PluginLoader.importPlugins()
}
