import { execSync, spawnSync } from 'child_process'
import { register } from 'esbuild-register/dist/node'
import fs from 'fs'
import kleur from 'kleur'
import path from 'path'

import type { PublishConfig, PublishOptions } from './types'

const getTag = (cwd: string) => {
    try {
        const tagList = execSync(`yarn npm tag list --json`, { cwd })
        return JSON.parse(tagList.toString()).locator.split('@').pop()
    } catch (error) {
        return
    }
}

export const publishModule = async (options: PublishOptions) => {
    const { unregister } = register()
    const dirs = await fs.promises.readdir(path.join(__dirname, '../../'))

    for (const dir of dirs) {
        if (options.name && dir !== options.name) continue
        const cwd = path.join(__dirname, '../../', dir)
        if (!fs.existsSync(path.join(cwd, 'module.config.ts'))) continue
        const config: PublishConfig = require(path.join(cwd, 'module.config.ts')).publish
        if (!config) continue

        const packageJson = JSON.parse(
            await fs.promises.readFile(path.join(cwd, 'package.json'), 'utf8'),
        )
        const latest = getTag(cwd)
        const current = packageJson.version
        if (latest && current && latest === current) {
            console.log(
                kleur.yellow(`${dir} is already published with the latest version (${current})`),
            )
            continue
        }

        const publishTempDir = path.join('node_modules', '.dev-tools', 'publish', dir)

        if (fs.existsSync(publishTempDir)) await fs.promises.rm(publishTempDir, { recursive: true })
        await fs.promises.mkdir(publishTempDir, { recursive: true })

        const root =
            typeof config === 'boolean'
                ? cwd
                : path.isAbsolute(config.root)
                ? config.root
                : path.join(cwd, config.root)

        if (root !== cwd) {
            if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
                console.error(kleur.red(`Publish root ${root} not exists`))
                continue
            }
            await fs.promises.writeFile(
                path.join(publishTempDir, 'package.json'),
                JSON.stringify(packageJson, null, 2),
            )
        }

        await fs.promises.cp(root, publishTempDir, { recursive: true })
        await fs.promises.writeFile(path.join(publishTempDir, 'yarn.lock'), '')

        if (packageJson.publishConfig) {
            for (const key in packageJson.publishConfig) {
                packageJson[key] = packageJson.publishConfig[key]
                delete packageJson.publishConfig[key]
            }
            if (Object.keys(packageJson.publishConfig).length === 0)
                delete packageJson.publishConfig
        }

        await fs.promises.writeFile(
            path.join(publishTempDir, 'package.json'),
            JSON.stringify(packageJson, null, 2),
        )

        if (options.dryRun) {
            console.log(kleur.yellow('Dry run, not publishing'))
        } else {
            spawnSync('yarn', { cwd: publishTempDir, stdio: 'inherit' })
            const result = spawnSync('yarn', ['npm', 'publish'], {
                cwd: publishTempDir,
                stdio: 'inherit',
            })

            if (result.status !== 0) {
                console.error(kleur.red(`Publish module ${dir} failed`))
            } else {
                console.log(kleur.green(`Publish module ${dir} success`))
            }
        }

        await fs.promises.rm(publishTempDir, { recursive: true })
    }

    unregister()
}
