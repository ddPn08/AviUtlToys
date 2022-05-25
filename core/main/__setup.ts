import { app } from 'electron'
import path from 'path'

const isDev = process.env['NODE_ENV'] === 'development'

if (isDev) for (const v of ['source-map-support', 'esbuild-register']) require(v)

app.setPath('userData', path.join(app.getPath('appData'), 'aviutil-toys'))
