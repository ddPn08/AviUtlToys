import properties from '@aviutil-toys/config/properties.json' assert { type: 'json' }
import { spawn } from 'child_process'
import electronBuilder from 'electron-builder'
import esbuild from 'esbuild'
import svgrPlugin from 'esbuild-plugin-svgr'
import fs from 'fs'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(path.dirname(import.meta.url))
const __dev = process.env['NODE_ENV'] === 'development'
const require = createRequire(import.meta.url)
const cwd = path.dirname(__dirname)
const NODE_MODULES = path.join(cwd, '../node_modules')

/** @type {import('esbuild').Plugin} */
export const ExternalExporter = {
    name: 'aviutil-toys:external-exporter',
    setup(build) {
        const filter = new RegExp(path.join(cwd, 'browser/index.tsx').replaceAll('\\', '\\\\'))
        build.onLoad({ filter }, async (args) => {
            let contents = await fs.promises.readFile(args.path, 'utf8')
            if (contents.includes('/** @LOAD_GLOBALS */')) {
                const externals = properties['client.externals']
                    .map((v) => `window.___AVIUTIL_TOYS_GLOBALS['${v}']=await import('${v}')`)
                    .join(';')
                contents = contents.replace('/** @LOAD_GLOBALS */', `${externals}`)
            }
            return {
                pluginData: {
                    contents,
                },
                contents,
                loader: 'tsx',
            }
        })
    },
}

/**
 * @param {boolean} watch
 */
const bundle = async (watch) => {
    const outdir = path.join(cwd, 'dist')
    if (fs.existsSync(outdir)) await fs.promises.rm(outdir, { recursive: true })

    /** @type {import('esbuild').BuildOptions} */
    const config = {
        logLevel: 'info',
        bundle: true,
        sourcemap: __dev,
        minify: !__dev,
    }

    /** @type {Record<'client' | 'server', import('esbuild').BuildOptions>} */
    const options = {
        client: {
            ...config,
            entryPoints: [path.join(cwd, 'browser', 'index.tsx')],
            outfile: path.join(outdir, 'client', 'index.js'),
            format: 'esm',
            platform: 'browser',
            plugins: [ExternalExporter, svgrPlugin()],
            inject: [path.join(__dirname, 'shims', 'react.js')],
        },
        server: {
            ...config,
            entryPoints: {
                index: path.join(cwd, 'main', 'index.ts'),
                preload: path.join(cwd, 'preload', 'index.ts'),
            },
            outdir,
            format: 'cjs',
            platform: 'node',
            external: properties['server.externals'],
        },
    }

    await Promise.all([esbuild.build(options.server), esbuild.build(options.client)])

    if (watch) {
        esbuild.build({
            ...options.client,
            watch: true,
        })
    }

    await fs.promises.copyFile(
        path.join(cwd, 'browser', 'index.html'),
        path.join(outdir, 'client', 'index.html'),
    )
}

const bundlePlugin = async () => {
    const src = path.join(cwd, '../plugins')

    const plugins = await fs.promises.readdir(src)
    const dist = path.join(cwd, 'dist', 'plugins')
    if (!fs.existsSync(dist)) await fs.promises.mkdir(dist)

    for (const plugin of plugins) {
        const dir = path.join(src, plugin)
        const packageJson = JSON.parse(
            await fs.promises.readFile(path.join(dir, 'package.json'), 'utf-8'),
        )
        const srcDir = path.join(dir, 'dist')
        const dest = path.join(dist, packageJson.name)
        if (!fs.existsSync(srcDir)) continue

        if (fs.existsSync(dest)) await fs.promises.rm(dest, { recursive: true })
        await fs.promises.cp(srcDir, dest, { recursive: true })
    }
}

const build = async () => {
    /** @type {string[]} */
    const resolved = []

    /**
     * @param {string} module
     * @returns {Promise<string[]>}
     */
    const getAllDependencies = async (module) => {
        resolved.push(module)
        const result = [module]
        if (!fs.existsSync(path.join(NODE_MODULES, module, 'package.json'))) return result
        const { dependencies, optionalDependencies, peerDependencies } = JSON.parse(
            await fs.promises.readFile(path.join(NODE_MODULES, module, 'package.json'), 'utf-8'),
        )
        const all = [
            ...Object.keys(dependencies || {}),
            ...Object.keys(optionalDependencies || {}),
            ...Object.keys(peerDependencies || {}),
        ]
        for (const dep of all) {
            if (resolved.includes(dep)) continue
            result.push(dep, ...(await getAllDependencies(dep)))
        }
        return result
    }

    const modules = new Set(await getAllDependencies('@aviutil-toys/core'))
    modules.delete('@aviutil-toys/core')
    const excludes = []
    for (const module of modules) {
        if (properties['server.externals'].includes(module)) continue
        excludes.push(`!node_modules/${module}/**/*`)
    }

    /** @type {import('electron-builder').CliOptions} */
    const options = {
        dir: true,
        config: {
            electronVersion: '19.0.1',
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
            compression: 'store',
            files: ['dist/**/*', ...excludes],
            asar: false,
        },
    }

    await electronBuilder.build(options)
    await fs.promises.writeFile(path.join(cwd, 'product/win-unpacked/resources/.portable'), '')
}

const bundleOnly = process.argv.includes('--bundle-only')
const watch = process.argv.includes('--watch')
const run = process.argv.includes('--run')

;(async () => {
    await bundle(watch)
    if (run) spawn('yarn', ['go:dev'], { stdio: 'inherit' })
    if (bundleOnly) return
    await bundlePlugin()
    await build()
    return
})()
