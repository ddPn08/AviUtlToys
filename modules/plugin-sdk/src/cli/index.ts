import 'esbuild-register'
import { Command } from 'commander'

import * as builder from './builder'
import * as init from './init'

export type BaseCliContext = {
    args: {}
}

const command = new Command()

command
    .command('build')
    .description('Build plugin')
    .option('-w, --watch', 'Watch for changes')
    .action((args) => {
        builder.run({ args })
    })
command
    .command('init')
    .description('Initialize plugin project')
    .action(() => {
        init.run()
    })
command.parse()
