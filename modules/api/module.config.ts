import { defineConfig } from '@aviutil-toys/dev-tools'
import fs from 'fs'
import path from 'path'

if (fs.existsSync(path.join(__dirname, 'dist')))
    fs.rmSync(path.join(__dirname, 'dist'), { recursive: true })

export default defineConfig({
    entriesPattern: '{server,client,root}/**/*.{ts,tsx}',
    outdir: path.join(__dirname, 'dist'),
    dts: true,
})
