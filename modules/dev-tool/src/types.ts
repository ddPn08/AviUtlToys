export type BuildApplicationOptions = {
    dev: boolean
    bundleOnly: boolean
    production: boolean
}

export type ModuleConfig = Partial<{
    entryPoints: string[]
    entriesPattern: string
    outdir: string
    outExtension: Record<string, string>
    format: ('cjs' | 'esm')[]
    platform: ('browser' | 'node')[]
    bundle: boolean
    external: string[]

    dts: boolean
    tsconfig: string

    onStart: () => Promise<void> | void
    onEnd: () => Promise<void> | void
}>

export type ModuleOptions = {
    watch?: boolean
    name?: string
}

export type PublishConfig =
    | {
          root: string
      }
    | boolean

export type PublishOptions = {
    dryRun: boolean
    name?: string
}