import './__setup'
import { AviUtilToys, Configuration } from '@aviutil-toys/api/server'
import { app, BrowserWindow } from 'electron'
import path from 'path'

import { Development } from './development'
import { PluginLoader } from './plugin-loader'

app.once('ready', async () => {
    await loadPLugins()
    for (const { hook, context } of AviUtilToys.plugins.hook('preInitialization'))
        await hook(context)

    await import('./ipc/api')
    await import('./ipc/system')

    await Configuration.load()
    await createWindow()
    Development.init()

    for (const { hook, context } of AviUtilToys.plugins.hook('postInitialization'))
        await hook(context)
})

const loadPLugins = async () => {
    const pluginDirs = [path.join(app.getPath('userData'), 'plugins')]
    if (Development.isDev) pluginDirs.push(path.join(__dirname, '../../plugins'))
    else pluginDirs.push(path.join(__dirname, 'plugins'))

    for (const dir of pluginDirs) await PluginLoader.preLoadPlugins(dir)
    await PluginLoader.loadPlugins()
}

const createWindow = async () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 960,
        minHeight: 480,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#ffffff',
    })

    window.loadURL(`file://${path.join(__dirname, 'client', 'index.html')}#/toys/system/general`)
    if (Development.isDev) window.webContents.openDevTools()
}
