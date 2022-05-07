import fs from 'fs'
import path from 'path'

import { NODE_MODULES } from './node_modules'

export const getAllDependencies = async (module: string) => {
    const result = [module]
    if (!fs.existsSync(path.join(NODE_MODULES, module, 'package.json'))) return result
    const { dependencies } = JSON.parse(
        await fs.promises.readFile(path.join(NODE_MODULES, module, 'package.json'), 'utf-8'),
    )
    if (!dependencies) return result
    for (const dep of Object.keys(dependencies))
        result.push(dep, ...(await getAllDependencies(dep)))
    return result
}
