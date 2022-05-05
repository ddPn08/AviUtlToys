import { spawn } from 'child_process'
import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'

import { __setup } from '../../__setup.mjs'

const { __dirname } = __setup(import.meta.url)
const cwd = path.join(__dirname, '..', '..', '..', 'modules', 'app')

export const bundlePlugins = async () => {
  const pluginsDir = path.join(__dirname, '..', '..', '..', 'plugins')
  const plugins = await fs.promises.readdir(pluginsDir)

  const dist = path.join(cwd, 'dist', 'plugins')

  if (!fs.existsSync(dist)) await fs.promises.mkdir(dist)

  for (const plugin of plugins) {
    const dir = path.join(pluginsDir, plugin)
    const packageJson = JSON.parse(await fs.promises.readFile(path.join(dir, 'package.json')))
    const files = packageJson.files || ['dist']
    const distDir = path.join(dist, packageJson.name)
    if (fs.existsSync(distDir)) await fs.promises.rm(distDir)
    await fs.promises.mkdir(distDir)
    for (const file of ['package.json', 'dist', ...files]) {
      await fs.promises.cp(path.join(dir, file), path.join(distDir, file), { recursive: true })
    }
  }

  console.log('Bundle plugins complete')
}

/**
 *
 * @param {{dev: boolean}}
 */
export const bundleApplication = async ({ dev }) => {
  const outdir = path.join(cwd, 'dist')

  if (fs.existsSync(outdir)) await fs.promises.rm(outdir, { recursive: true })

  /** @type {Record<'server'|'client', import('esbuild').BuildOptions>} */
  const options = {
    client: {
      entryPoints: [path.join(cwd, 'browser', 'index.tsx')],
      outfile: path.join(outdir, 'client', 'index.js'),
      external: global['__aviutil_toys']['client.externals'],
      bundle: true,
      sourcemap: true,
      loader: {
        '.svg': 'text',
      },
      watch: dev
        ? {
            onRebuild(err, result) {
              if (err) return console.error(err)
              console.log(result)
            },
          }
        : false,
      inject: [path.join(__dirname, 'shims', 'react.js')],
      platform: 'node',
    },
    server: {
      entryPoints: {
        index: path.join(cwd, 'main', 'index.ts'),
        preload: path.join(cwd, 'preload', 'index.ts'),
      },
      outdir,
      external: ['electron', 'esbuild', 'esbuild-windows-64', '@aviutil-toys/api'],
      format: 'cjs',
      bundle: true,
      sourcemap: true,
      sourceRoot: path.join(cwd, 'dist'),
      platform: 'node',
      plugins: [
        {
          name: 'define esbuild binary path',
          setup(build) {
            build.onEnd(async () => {
              const file = path.join(outdir, 'index.js')
              const line = `process.env['ESBUILD_BINARY_PATH']=require.resolve('esbuild-windows-64/esbuild.exe').replace('app.asar', 'app.asar.unpacked')\n`
              const content = await fs.promises.readFile(file, 'utf8')
              const newContent = `${line}\n${content}`
              await fs.promises.writeFile(file, newContent)
            })
          },
        },
      ],
    },
  }
  try {
    await build(options.server)
    await build(options.client)
  } catch (_) {}

  await fs.promises.copyFile(
    path.join(cwd, 'browser', 'index.html'),
    path.join(outdir, 'client', 'index.html'),
  )

  console.log('Bundle complete')

  bundlePlugins()

  if (dev)
    spawn('yarn', ['electron', 'dist/index.js', '--remote-debugging-port=9222'], {
      stdio: 'inherit',
      cwd: cwd,
      env: { ...process.env, NODE_ENV: 'development' },
    }).on('exit', process.exit)
}
