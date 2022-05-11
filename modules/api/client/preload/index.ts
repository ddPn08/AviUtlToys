import type { ipcRenderer } from 'electron'

import type { ClientPlugin } from '../plugin.js'

export * from './electron.js'

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer
        plugins: ClientPlugin[]
        ready: boolean
    }
}
