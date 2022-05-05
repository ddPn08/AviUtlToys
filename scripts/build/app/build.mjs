import { build } from 'electron-builder'
import path from 'path'

import { __setup } from '../../__setup.mjs'
import { getAllDependencies } from '../../util/dependencies.mjs'

const { __dirname, require, node_modules } = __setup(import.meta.url)
const cwd = path.join(__dirname, '..', '..', '..', 'modules', 'app')

export const buildApplication = async () => {
  const externals = new Set(
    (
      await Promise.all(
        [
          '@aviutil-toys/app',
          '@aviutil-toys/api',
          '@aviutil-toys/assets',
          ...global['__aviutil_toys']['client.externals'],
        ].map(getAllDependencies),
      )
    ).flat(),
  )
  externals.delete('@aviutil-toys/app')

  /** @type {import('electron-builder').CliOptions} */
  const options = {
    config: {
      appId: 'world.ddpn.aviutil-toys',
      productName: 'aviutil-toys',
      artifactName: '${productName}-${version}.${ext}',
      copyright: 'Copyright © 2022 ddPn08',
      icon: require.resolve('@aviutil-toys/assets/image/icon.png'),
      directories: { app: cwd, output: path.join(cwd, 'product') },
      win: {
        target: [
          {
            target: 'nsis',
            arch: 'x64',
          },
        ],
      },
      compression: 'maximum',
      files: ['dist/**/*', ...Array.from(externals).map((v) => `${node_modules}/${v}`)],
      asarUnpack: [
        'dist/client',
        'dist/plugins',
        ...Array.from(externals).map((v) => `node_modules/${v}`),
      ],
      asar: true,
    },
  }

  await build(options)
}
