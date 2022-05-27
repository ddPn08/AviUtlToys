import type { ipcRenderer } from 'electron'

export * from './electron.js'

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer
    }
}
