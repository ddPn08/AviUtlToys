import type { ToyContextType } from './toy.js'

export type PluginMeta = {
    toys: ToyContextType[]
}
export type ClientPluginFn = () => PluginMeta | Promise<PluginMeta>
export type ClientPlugin = {
    default: ClientPluginFn
}
export const createPlugin = (plugin: ClientPluginFn) => plugin
