import cac from 'cac'

import packageJson from '../../package.json'
import * as builder from './builder'
import * as newProject from './new'

export type BaseCliContext = {
    args: {}
}

const cli = cac('aviutl-toys')

cli.version(packageJson.version)

cli.command('build')
    .option('-w, --watch', 'Watch for changes')
    .action((args) => {
        builder.run({ args })
    })
cli.command('new [name]').action((name: string) => {
    newProject.run({
        name,
    })
})

cli.help()
cli.parse()
