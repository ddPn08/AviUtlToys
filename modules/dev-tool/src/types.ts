export type BuildApplicationOptions = {
    dev: boolean
    bundleOnly: boolean
}

export type ModuleConfig = Partial<{
    entryPoints: string[]
    entriesPattern: string
    outdir: string
    format: ('cjs' | 'esm')[]
    platform: ('browser' | 'node')[]
    bundle: boolean
    external: string[]

    dts: boolean
    tsconfig: string

    onEnd: () => Promise<void> | void
}>
