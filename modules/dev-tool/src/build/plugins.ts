import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export const buildPlugins = async () => {
    const pluginsDir = path.join(__dirname, '../../../../plugins')
    const plugins = await fs.promises.readdir(pluginsDir)
    for (const plugin of plugins)
        execSync('yarn build', {
            cwd: path.join(pluginsDir, plugin),
            stdio: 'inherit',
        })
}
