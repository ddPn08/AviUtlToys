import type { IPackageJson } from 'package-json-type'

export type PluginMeta = {
    entry: {
        server: string
        client: string
    }
    meta: IPackageJson
}
export type PluginContext = {
    dataFolder: string
    meta: IPackageJson
}
export type PluginContextFn = (c: PluginContext) => void
export type Plugin = {
    default: PluginContextFn
    meta: IPackageJson
}
export const createPlugin = (plugin: PluginContextFn) => plugin
