import { BrowserWindow } from 'electron'
import fs, { FSWatcher, WatchListener } from 'fs'
import path from 'path'

export namespace Development {
    const clientWatcher: { watcher: FSWatcher; filename: string }[] = []

    const clientWatcherListener: WatchListener<string> = (_, filename) => {
        console.log(`Client file changed: ${filename}`)
        console.log(`Reloading client...`)
        BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.reload()
        })
    }

    export const addClientWatchFile = (file: string) => {
        if (clientWatcher.some((w) => w.filename === file)) return
        clientWatcher.push({
            watcher: fs.watch(file, clientWatcherListener),
            filename: file,
        })
    }

    export const init = () => {
        addClientWatchFile(path.join(__dirname, 'client', 'index.js'))
    }
}
