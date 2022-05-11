import { BuildConfig, isBuildConfig, OverrideEsbuildOptions } from '@aviutil-toys/api'
import { build, BuildOptions, Plugin } from 'esbuild'
import fs from 'fs'
import kleur from 'kleur'
import path from 'path'

import properties from '../../../../properties.json'

const packageJsonExporter = (config: BuildConfig, packageJson: Record<string, any>): Plugin => {
    return {
        name: 'package-json-exporter',
        setup(build) {
            build.onLoad(
                {
                    filter: /^.*\.(ts|tsx)$/g,
                },
                async (args) => {
                    if (
                        args.path === path.resolve(config.client.entry) ||
                        args.path === path.resolve(config.server.entry)
                    ) {
                        let contents = await fs.promises.readFile(args.path, 'utf8')
                        contents += `\nexport const meta = ${JSON.stringify(packageJson, null, 2)}`
                        return {
                            contents,
                            loader: args.path.endsWith('.ts') ? 'ts' : 'tsx',
                        }
                    }
                    return {}
                },
            )
        },
    }
}

const mergeConfig = (options: BuildOptions, overrides: Partial<OverrideEsbuildOptions>) => {
    const { external, plugins, inject, ...rest } = options
    return {
        ...rest,
        external: [...(external || []), ...(overrides.external || [])],
        inject: [...(inject || []), ...(overrides.inject || [])],
        plugins: [...(plugins || []), ...(overrides.plugins || [])],
    }
}

const loadConfig = async (cwd: string) => {
    await build({
        entryPoints: [path.join(cwd, 'aut.config.ts')],
        outdir: path.resolve('node_modules/.aviutil-toys'),
        bundle: false,
        format: 'cjs',
        platform: 'node',
    })
    const config = require(path.resolve('node_modules/.aviutil-toys/aut.config.js')).default
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

    const packageJson = JSON.parse(
        await fs.promises.readFile(path.join(process.cwd(), 'package.json'), 'utf-8'),
    )

    const watchOption: BuildOptions['watch'] = {
        onRebuild(error, result) {
            if (!error) {
                console.log(kleur.green('INFO'), 'Build success!')
                if (result?.outputFiles)
                    console.log('INFO', kleur.cyan(result.outputFiles.join('\n')))
            }
        },
    }
    const commonConfig = {
        bundle: true,
        watch: context.args.watch ? watchOption : false,
        plugins: [packageJsonExporter(config, packageJson)],
    }
    try {
        await Promise.all([
            build(
                mergeConfig(
                    {
                        entryPoints: [serverEntry],
                        logLevel: 'info',
                        external: ['electron', '@aviutil-toys/api', '@aviutil-toys/api/*'],
                        outfile: './dist/server.js',
                        format: 'cjs',
                        platform: 'node',
                        ...commonConfig,
                    },
                    config.server.esbuild || {},
                ),
            ),
            build(
                mergeConfig(
                    {
                        entryPoints: [clientEntry],
                        logLevel: 'info',
                        external: [
                            ...properties['client.externals'],
                            ...(config.client.esbuild?.external ?? []),
                        ],
                        outfile: './dist/client.js',
                        format: 'esm',
                        inject: (
                            await fs.promises.readdir(path.join(__dirname, 'shims'))
                        ).map((file) => path.join(__dirname, 'shims', file)),
                        ...commonConfig,
                    },
                    config.client.esbuild || {},
                ),
            ),
        ])
        console.log(kleur.green('INFO'), 'Build success!')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
