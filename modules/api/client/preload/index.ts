import type { ipcRenderer } from 'electron'

import type { ClientPlugin } from '../plugin'

export * from './electron'

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer
        plugins: ClientPlugin[]
        ready: boolean
    }
}
