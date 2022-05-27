import { build, BuildOptions } from 'esbuild'
import { register } from 'esbuild-register/dist/node'
import fs from 'fs'
import path from 'path'
import glob from 'tiny-glob'
import typescript from 'typescript'

import type { ModuleConfig, ModuleOptions } from '../types'
import { emitDeclaration } from './emit-declaration'

const DEFAULT_CONFIG: ModuleConfig = {
    format: ['cjs', 'esm'],
    platform: ['node'],
    entriesPattern: 'src',
    outdir: './dist/<platform>/<format>',
}

const formatOutDir = (cwd: string, outdir: string, platform: string, format: string) => {
    const replaced = outdir.replace(/<platform>/g, platform).replace(/<format>/g, format)
    return path.isAbsolute(replaced) ? replaced : path.join(cwd, replaced)
}

export const buildModule = async (options: ModuleOptions) => {
    const { unregister } = register()
    const dirs = await fs.promises.readdir(path.join(__dirname, '../../../'))
    for (const dir of dirs) {
        if (options.name && dir !== options.name) continue
        const cwd = path.join(__dirname, '../../../', dir)
        if (!fs.existsSync(path.join(cwd, 'module.config.ts'))) continue
        const configs: Record<string, Required<ModuleConfig>> = {
            ...require(path.join(cwd, 'module.config.ts')).default,
        }
        const packageJson = JSON.parse(
            await fs.promises.readFile(path.join(cwd, 'package.json'), 'utf8'),
        )

        for (let config of Object.values(configs)) {
            config = { ...DEFAULT_CONFIG, ...config }

            if (config.onStart) await config.onStart()

            if (config.entryPoints) {
                config.entryPoints = config.entryPoints.map((entry) =>
                    path.isAbsolute(entry) ? entry : path.join(cwd, entry),
                )
            }
            if (!config.entryPoints && config.entriesPattern) {
                const entries = await glob(
                    path.join(cwd, config.entriesPattern).replace(/\\/g, '/'),
                )
                config.entryPoints = entries
            }

            const declarationDir = formatOutDir(cwd, config.outdir, '', 'types')

            const tsconfigPath = path.join(cwd, 'tsconfig.json') || config.tsconfig
            typescript.parseJsonConfigFileContent(
                typescript.readConfigFile(tsconfigPath, typescript.sys.readFile).config,
                typescript.sys,
                cwd,
            )

            const dependencies = [
                ...Object.keys(packageJson.dependencies || {}),
                ...Object.keys(packageJson.peerDependencies || {}),
            ]
            if (config.internal)
                for (const dep of config.internal)
                    delete dependencies[dependencies.findIndex((d) => d === dep)]

            for (const format of config.format) {
                for (const platform of config.platform) {
                    const outdir = formatOutDir(cwd, config.outdir, platform, format)

                    const esbuildConfig: BuildOptions = {
                        outdir,
                        platform,
                        format,
                        logLevel: 'info',
                        watch: !!options.watch,
                        entryPoints: config.entryPoints,
                        bundle: config.bundle || true,
                        outExtension: config.outExtension || {
                            '.js': format === 'cjs' ? '.js' : '.mjs',
                        },
                        external: [...(config.external || []), ...dependencies],
                    }
                    await build(esbuildConfig)
                }
            }

            if (config.onEnd) await config.onEnd()
            if (config.dts) emitDeclaration(config.entryPoints, cwd, declarationDir, options)
        }
    }

    unregister()
}
