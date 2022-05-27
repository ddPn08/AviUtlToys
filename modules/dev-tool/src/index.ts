import { cac } from 'cac'

import { buildModule } from './build/module'
import { publishModule } from './publish'
import type { ModuleConfig, ModuleOptions, PublishOptions } from './types'

const cli = cac('build-cli')

cli.command('build:module', 'build modules')
    .option('--watch', 'watch for changes')
    .option('--name [name]', 'module name')
    .action(async (options: ModuleOptions) => {
        buildModule(options)
    })

cli.command('publish:module', 'publish modules')
    .option('--dry-run', 'dry run')
    .option('--name [name]', 'module name')
    .action(async (options: PublishOptions) => {
        publishModule(options)
    })

cli.parse()

export const defineConfig = (...configs: ModuleConfig[]) => configs

export * from './types'
