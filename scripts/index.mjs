import { cac } from 'cac'

import { buildApi } from './build/api.mjs'
import { buildApplication } from './build/app/build.mjs'
import { bundleApplication } from './build/app/bundle.mjs'
import { buildPluginSdk } from './build/plugin-sdk.mjs'

const cli = cac('build-cli')

cli
  .command('build:app', 'build the project')
  .option('--production', 'build for production')
  .option('--dev', 'watch for changes')
  .action(async (options) => {
    await bundleApplication(options)
    if (options.production) await buildApplication(options)
  })

cli.command('build:module', 'build modules').action(async () => {
  buildPluginSdk()
  buildApi()
})

cli.parse()
