import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import kleur from 'kleur'
import path from 'path'

import type { PublishOptions } from './types'

const getTag = (cwd: string) => {
    try {
        const tagList = execSync(`yarn npm tag list --json`, { cwd })
        return JSON.parse(tagList.toString()).locator.split('@').pop()
    } catch (error) {
        return
    }
}

export const publishModule = async (options: PublishOptions) => {
    const dirs = await fs.promises.readdir(path.join(__dirname, '../../'))

    for (const dir of dirs) {
        if (options.name && dir !== options.name) continue
        const cwd = path.join(__dirname, '../../', dir)

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

        if (packageJson.scripts && 'publish' in packageJson.scripts) {
            console.log(kleur.yellow(`Publishing ${dir}...`))
            spawnSync('yarn', ['publish'], { cwd, stdio: 'inherit' })
        }
    }
}
