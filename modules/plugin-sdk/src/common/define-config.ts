import type { Plugin } from 'esbuild'

export type OverrideEsbuildOptions = {
    external: string[]
    plugins: Plugin[]
    inject: string[]
}

export type BuildConfig = {
    server: {
        entry: string
        esbuild?: Partial<OverrideEsbuildOptions>
    }
    client: {
        entry: string
        esbuild?: Partial<OverrideEsbuildOptions>
    }
}

export const defineConfig = (config: BuildConfig) => config
export const isBuildConfig = (config: any): config is BuildConfig =>
    typeof config === 'object' &&
    typeof config.server === 'object' &&
    typeof config.server.entry === 'string' &&
    typeof config.client === 'object' &&
    typeof config.client.entry === 'string'
