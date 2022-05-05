import type { PluginMeta, Plugin } from '@aviutil-toys/api/server'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export namespace PluginLoader {
    export const pluginMetas: PluginMeta[] = []
    export const plugins: Plugin[] = []

    export const loadPlugins = async (pluginDir: string) => {
        if (!fs.existsSync(pluginDir)) await fs.promises.mkdir(pluginDir)

        const files = await fs.promises.readdir(pluginDir)
        const pluginDirs = await Promise.all(
            files.filter(async (file) =>
                (await fs.promises.lstat(path.join(pluginDir, file))).isDirectory(),
            ),
        )
        for (const dir of pluginDirs) {
            if (!fs.existsSync(path.join(pluginDir, dir, 'package.json'))) {
                console.warn(`Plugin ${dir} is missing package.json`)
                continue
            }
            if (!fs.existsSync(path.join(pluginDir, dir, 'dist', 'client.js'))) {
                console.warn(`Plugin ${dir} is missing client.js`)
                continue
            }
            if (!fs.existsSync(path.join(pluginDir, dir, 'dist', 'server.js'))) {
                console.warn(`Plugin ${dir} is missing server.js`)
                continue
            }

            const meta: PluginMeta['meta'] = JSON.parse(
                await fs.promises.readFile(path.join(pluginDir, dir, 'package.json'), 'utf-8'),
            )

            if (!meta.name || !meta.description || !meta['id'] || !meta.version) {
                console.warn(`Plugin ${dir} is missing a required field.`)
                continue
            }

            console.log(`Loading plugin ${meta.name}`)

            pluginMetas.push({
                entry: {
                    server: path.join(pluginDir, dir, 'dist', 'server.js'),
                    client: path.join(pluginDir, dir, 'dist', 'client.js'),
                },
                meta,
            })
        }
    }
    export const importPlugins = async () => {
        const pluginDataDir = path.join(app.getPath('userData'), 'pluginData')
        if (!fs.existsSync(pluginDataDir)) await fs.promises.mkdir(pluginDataDir)

        for (const pluginMeta of pluginMetas) {
            const plugin: Plugin = require(pluginMeta.entry.server)
            const dataFolder = path.join(pluginDataDir, pluginMeta.meta['id'])
            if (!fs.existsSync(dataFolder)) await fs.promises.mkdir(dataFolder)
            plugin.default({
                dataFolder,
                meta: pluginMeta.meta,
            })
            plugins.push(plugin)
        }
    }
}
