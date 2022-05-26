import crypto from 'crypto'
import { app, BrowserWindow } from 'electron'
import { build, BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'

import { isDev } from '..'
import { PluginLoader } from '../plugin-loader'
import { PluginLoaderPlugin } from './plugins/plugin-loader'

const createBuildMeta = () => {
    return Promise.all(
        PluginLoader.pluginMetas.map(async ({ entry }) => ({
            path: entry.client,
            md5: crypto
                .createHash('md5')
                .update(await fs.promises.readFile(entry.client, 'utf8'), 'binary')
                .digest('hex'),
        })),
    )
}

export const buildClient = async (window: BrowserWindow) => {
    const srcDir = path.join(__dirname, 'client').replace('app.asar', 'app.asar.unpacked')
    const outdir = isDev ? __dirname : path.join(app.getPath('userData'), '.dist')

    try {
        const previous = JSON.parse(
            await fs.promises.readFile(path.join(outdir, '.build.json'), 'utf-8'),
        )
        const current = await createBuildMeta()
        if (JSON.stringify(previous) === JSON.stringify(current)) {
            console.log('No changes in plugins, skipping rebuild')
            return outdir
        }
    } catch (_) {
        console.log('No previous build, rebuilding')
    }

    const options: BuildOptions = {
        entryPoints: [path.join(srcDir, 'index.js')],
        outfile: path.join(outdir, 'client.js'),
        bundle: true,
        target: 'esnext',
        format: 'esm',
        platform: 'browser',
        minify: !isDev,
        sourcemap: isDev,
        watch: {
            async onRebuild() {
                if (!isDev) return

                await new Promise((resolve) => setTimeout(resolve, 250))
                console.log('Client build done!')
                const url = new URL(window.webContents.getURL())
                window.loadURL(`file://${path.join(outdir, 'index.html')}${url.hash}`)
            },
        },
        plugins: [PluginLoaderPlugin],
    }
    await build(options)
    await fs.promises.copyFile(path.join(srcDir, 'index.html'), path.join(outdir, 'index.html'))

    const hashList = await createBuildMeta()
    await fs.promises.writeFile(path.join(outdir, '.build.json'), JSON.stringify(hashList))

    return outdir
}
