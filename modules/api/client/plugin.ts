import type { IPackageJson } from 'package-json-type'

import type { FutureContextType } from './future.js'

export type PluginMeta = {
    futures: FutureContextType[]
}
export type ClientPluginFn = () => PluginMeta | Promise<PluginMeta>
export type ClientPlugin = {
    default: ClientPluginFn
    meta: IPackageJson
}
export const createPlugin = (plugin: ClientPluginFn) => plugin
