import { BrowserWindow } from 'electron'
import fs, { FSWatcher, WatchListener } from 'fs'
import path from 'path'

export namespace Development {
    export const isDev = process.env['NODE_ENV'] === 'development'
    const clientWatcher: { watcher: FSWatcher; filename: string }[] = []

    const clientWatcherListener: WatchListener<string> = (_, filename) => {
        if (!isDev) return
        console.log(`Client file changed: ${filename}`)
        console.log(`Reloading client...`)
        BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.reload()
        })
    }

    export const addClientWatchFile = (file: string) => {
        if (!isDev) return
        if (clientWatcher.some((w) => w.filename === file)) return
        clientWatcher.push({
            watcher: fs.watch(file, clientWatcherListener),
            filename: file,
        })
    }

    export const init = () => {
        if (!isDev) return
        console.log('Development mode enabled')
        addClientWatchFile(path.join(__dirname, 'client', 'index.js'))
    }
}
