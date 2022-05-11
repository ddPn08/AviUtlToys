import type { BuildOptions } from 'esbuild'

export type BuildConfig = {
    server: {
        entry: string
        esbuild?: Partial<BuildOptions>
    }
    client: {
        entry: string
        esbuild?: Partial<BuildOptions>
    }
}

export const definePluginConfig = (config: BuildConfig) => config
export const isBuildConfig = (config: any): config is BuildConfig =>
    typeof config === 'object' &&
    typeof config.server === 'object' &&
    typeof config.server.entry === 'string' &&
    typeof config.client === 'object' &&
    typeof config.client.entry === 'string'
