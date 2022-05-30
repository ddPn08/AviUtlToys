import type { PluginMeta } from '../plugin'

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
    'plugin:list': () => PluginMeta[]
    'aviutil:run': () => void
}
