import type { FutureContextType } from './future.js'

export type PluginMeta = {
    futures: FutureContextType[]
}
export type ClientPluginFn = () => PluginMeta | Promise<PluginMeta>
export type ClientPlugin = {
    default: ClientPluginFn
}
export const createPlugin = (plugin: ClientPluginFn) => plugin
