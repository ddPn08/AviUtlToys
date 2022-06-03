import properties from '@aviutil-toys/config/properties.json'
import { build, BuildOptions } from 'esbuild'
import fs from 'fs'
import kleur from 'kleur'
import path from 'path'

import { isBuildConfig } from '../../common'
import { GlobalsResolver } from './plugins/globals-resolver'

const mergeConfig = (options: BuildOptions, ...overrides: Partial<BuildOptions>[]) => {
    let result: BuildOptions = { ...options }
    for (const override of overrides) {
        const { external, plugins, inject, ...rest } = override
        result.external = [...(result.external || []), ...(external || [])]
        result.plugins = [...(result.plugins || []), ...(plugins || [])]
        result.inject = [...(result.inject || []), ...(inject || [])]
        result = {
            ...result,
            ...rest,
        }
    }
    return result
}

const loadConfig = async (cwd: string) => {
    await build({
        entryPoints: [path.join(cwd, 'aut.config.ts')],
        outdir: path.resolve('node_modules/.aviutil-toys/tmp'),
        bundle: false,
        format: 'cjs',
        platform: 'node',
    })
    const config = require(path.resolve('node_modules/.aviutil-toys/tmp/aut.config.js')).default
    if (!isBuildConfig(config)) {
        console.error(kleur.red('ERROR'), 'Invalid config!')
        process.exit(1)
    }
    return config
}

export const run = async (context: { args: { watch: boolean } }) => {
    console.log(kleur.cyan('INFO'), 'Building plugin...')

    const config = await loadConfig('.')
    const serverEntry = config.server.entry
    const clientEntry = config.client.entry
    const packageJsonPath = path.join(process.cwd(), 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
        console.error(kleur.red('Missing package.json!'))
        process.exit(1)
    }
    if (!fs.existsSync(serverEntry)) {
        console.error(kleur.red(`Missing server entry ${serverEntry}!`))
        process.exit(1)
    }
    if (!fs.existsSync(clientEntry)) {
        console.error(kleur.red(`Missing client entry ${clientEntry}!`))
        process.exit(1)
    }

    const watchOption: BuildOptions['watch'] = {
        onRebuild(error, result) {
            if (!error) {
                console.log(kleur.green('INFO'), 'Build success!')
                if (result?.outputFiles)
                    console.log('INFO', kleur.cyan(result.outputFiles.join('\n')))
            }
        },
    }
    const commonConfig: BuildOptions = {
        bundle: true,
        minify: true,
        watch: context.args.watch ? watchOption : false,
    }

    const outdir = path.resolve(config.outdir || 'dist')

    try {
        await Promise.all([
            build(
                mergeConfig(commonConfig, config.server.esbuild || {}, {
                    entryPoints: [serverEntry],
                    external: properties['server.externals'],
                    outfile: path.join(outdir, 'server.js'),
                    format: 'cjs',
                    jsxFactory: 'jsx',
                    jsxFragment: 'Fragment',
                    platform: 'node',
                }),
            ),
            build(
                mergeConfig(commonConfig, config.client.esbuild || {}, {
                    entryPoints: [clientEntry],
                    outfile: path.join(outdir, 'client.js'),
                    format: 'esm',
                    platform: 'browser',
                    inject: (
                        await fs.promises.readdir(path.join(__dirname, 'shims'))
                    ).map((file) => path.join(__dirname, 'shims', file)),
                    plugins: [GlobalsResolver],
                }),
            ),
        ])
        await fs.promises.cp(packageJsonPath, path.join(outdir, 'package.json'))

        console.log(kleur.green('INFO'), 'Build success!')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
