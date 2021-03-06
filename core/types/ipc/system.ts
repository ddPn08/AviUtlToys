import type { PluginMeta } from '../plugin'

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
    'update:check': () => boolean
    'plugin:list': () => PluginMeta[]
    'aviutl:run': () => void
}
