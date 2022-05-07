import './properties'
import { cac } from 'cac'

import { buildApplication } from './build/app/build'
import { bundleApplication } from './build/app/bundle'
import { buildModule } from './build/module'
import type { BuildApplicationOptions, ModuleConfig } from './types'

const cli = cac('build-cli')

cli.command('build:app', 'build the project')
    .option('--bundle-only', 'bundle only')
    .option('--dev', 'watch for changes')
    .action(async (options: BuildApplicationOptions) => {
        await bundleApplication(options)
        if (!options.bundleOnly) await buildApplication()
    })

cli.command('build:module', 'build modules').action(async () => {
    buildModule()
})

cli.parse()

export const defineConfig = (...configs: ModuleConfig[]) => configs
