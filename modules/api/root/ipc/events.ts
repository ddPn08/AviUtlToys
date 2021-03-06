import type { OpenDialogOptions, OpenDialogReturnValue } from 'electron'

import type { ConfigurationType } from '../config.js'

export interface ServerToClientEvents {
    'config:update': (config: ConfigurationType) => void
}

export interface ClientToServerEvents {
    'window:close': () => void
    'window:minimize': () => void
    'window:toggleMaximize': () => void

    'shell:open-external': (url: string) => void

    'native:show-open-dialog': (options: OpenDialogOptions) => OpenDialogReturnValue
    'native:drag-file': (file: string, icon?: string) => void

    'config:get': () => ConfigurationType
    'config:update': (config: ConfigurationType) => void
}
