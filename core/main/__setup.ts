import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const isDev = process.env['NODE_ENV'] === 'development'
const appRoot = path.join(__dirname, '../../../')
const isPortable = !isDev && fs.existsSync(path.join(appRoot, 'resources/.portable'))
const userData = isPortable
    ? path.join(appRoot, 'userData')
    : path.join(app.getPath('appData'), 'aviutl-toys')

if (isDev) for (const v of ['source-map-support', 'esbuild-register']) require(v)

app.setPath('userData', userData)
