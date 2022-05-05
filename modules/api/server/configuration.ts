import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import type { ConfigurationType } from '../root'

export namespace Configuration {
    const configPath = path.join(app.getPath('userData'), 'config.json')
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({}))
    let config: ConfigurationType = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    export const get = () => config
    export const save = async (newConfig: ConfigurationType) => {
        config = newConfig
        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4))
    }
}
