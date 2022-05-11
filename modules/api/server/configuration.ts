import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import type { ConfigurationType } from '../root/index.js'

export namespace Configuration {
    const configPath = path.join(app.getPath('userData'), 'config.json')

    let config: ConfigurationType

    export const load = async () => {
        if (!fs.existsSync(configPath)) await fs.promises.writeFile(configPath, JSON.stringify({}))
        config = JSON.parse(await fs.promises.readFile(configPath, 'utf8'))
    }

    export const get = () => config
    export const save = async (newConfig: ConfigurationType) => {
        config = newConfig
        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4))
    }
}
