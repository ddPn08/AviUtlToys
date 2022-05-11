import type { IPackageJson } from 'package-json-type'

export type PluginMeta = {
    entry: {
        server: string
        client: string
    }
    meta: IPackageJson
}
