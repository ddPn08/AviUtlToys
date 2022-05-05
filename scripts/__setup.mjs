import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
global.__aviutil_toys = {
  'client.externals': require(path.join(dir, '..', 'properties.json'))['client.externals'],
}

/**
 * @param {string} url
 */
export const __setup = (url) => {
  return {
    __dirname: path.dirname(fileURLToPath(url)),
    require: createRequire(url),
    isDev: process.env['NODE_ENV'] === 'development',
    node_modules: path.join(dir, '..', '..', 'node_modules'),
  }
}
