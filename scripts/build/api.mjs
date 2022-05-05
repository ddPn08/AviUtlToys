import esbuild from 'esbuild'
import path from 'path'
import glob from 'tiny-glob'

import { __setup } from '../__setup.mjs'
import { emitDeclaration } from './emit-declaration.mjs'

const { __dirname } = __setup(import.meta.url)
const cwd = path.join(__dirname, '..', '..', 'modules', 'api')

export const buildApi = async () => {
  const files = await glob(path.posix.join(cwd.replace(/\\/g, '/'), `{client,root,server}/**/*.ts`))

  /**
   * Build module with esbuild
   */

  /** @type {import("esbuild").BuildOptions} */
  const options = {
    entryPoints: files,
    platform: 'node',
  }

  esbuild
    .build({
      ...options,
      outdir: path.join(cwd, 'dist'),
      format: 'cjs',
    })
    .then(() => console.log(`cjs build complete`))

  emitDeclaration(files, cwd, path.join(cwd, 'dist'))
}
