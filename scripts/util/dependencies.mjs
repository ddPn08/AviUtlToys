import fs from 'fs'
import path from 'path'

import { __setup } from '../__setup.mjs'

const { __dirname } = __setup(import.meta.url)
const NODE_MODULES = path.join(__dirname, '..', '..', 'node_modules')

/**
 * @param {string} module
 */
export const getAllDependencies = async (module) => {
  const result = [module]
  if (!fs.existsSync(path.join(NODE_MODULES, module, 'package.json'))) return result
  const { dependencies } = JSON.parse(
    await fs.promises.readFile(path.join(NODE_MODULES, module, 'package.json')),
  )
  if (!dependencies) return result
  for (const dep of Object.keys(dependencies)) result.push(dep, ...(await getAllDependencies(dep)))
  return result
}
