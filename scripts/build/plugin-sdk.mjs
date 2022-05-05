import { build } from 'esbuild'
import fs from 'fs-extra'
import path from 'path'
import glob from 'tiny-glob'

import { __setup } from '../__setup.mjs'
import { emitDeclaration } from './emit-declaration.mjs'

const { __dirname } = __setup(import.meta.url)
const cwd = path.join(__dirname, '..', '..', 'modules', 'plugin-sdk')

export const buildPluginSdk = async () => {
  const files = await glob(path.posix.join(cwd.replace(/\\/g, '/'), 'src/common/*.ts'))

  /**
   * Build cli
   */
  build({
    entryPoints: [path.join(cwd, 'src/cli/index.ts')],
    external: ['esbuild'],
    outdir: path.join(cwd, 'dist/cli'),
    format: 'cjs',
    platform: 'node',
    bundle: true,
    plugins: [
      {
        name: 'properties',
        setup(build) {
          build.onLoad({ filter: /\.ts?$/ }, (args) => {
            const contents = fs.readFileSync(args.path, 'utf8')
            return {
              contents: contents.replace(
                `global['__aviutil_toys']['client.externals']`,
                JSON.stringify(global['__aviutil_toys']['client.externals']),
              ),
              loader: 'ts',
            }
          })
          return
        },
      },
    ],
  })
    .then(() => {
      /**
       * Create shims
       */

      if (!fs.existsSync(path.join(cwd, 'dist/cli/shims')))
        fs.mkdirSync(path.join(cwd, 'dist/cli/shims'))

      fs.writeFileSync(
        path.join(cwd, 'dist/cli/shims/react.js'),
        `import * as React from 'react'; export { React }`,
      )
      console.log('Build cli success')
    })
    .catch(console.error)

  /**
   * Build module with esbuild
   */

  build({
    entryPoints: files,
    platform: 'node',
    outdir: path.join(cwd, 'dist'),
    format: 'cjs',
  })
    .then(() => console.log('Build common module success'))
    .catch(console.error)

  emitDeclaration(files, cwd, path.join(cwd, 'dist'))
}
