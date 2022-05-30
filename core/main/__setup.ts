import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const isDev = process.env['NODE_ENV'] === 'development'
const isPortable = !isDev && fs.existsSync(path.join(__dirname, '..', '..', '.portable'))

if (isDev) for (const v of ['source-map-support', 'esbuild-register']) require(v)

app.setPath(
    'userData',
    isPortable
        ? path.join(__dirname, '../../../userData')
        : path.join(app.getPath('appData'), 'aviutil-toys'),
)
