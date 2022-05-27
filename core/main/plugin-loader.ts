import type { Plugin } from '@aviutil-toys/api/server'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import type { PluginMeta } from '@/types'

export namespace PluginLoader {
    export const pluginMetas: PluginMeta[] = []
    export const plugins: Plugin[] = []

    export const loadPlugins = async (pluginDir: string) => {
        if (!fs.existsSync(pluginDir)) return

        const files = await fs.promises.readdir(pluginDir)

        const dirs = await Promise.all(
            files.filter(async (file) =>
                (await fs.promises.lstat(path.join(pluginDir, file))).isDirectory(),
            ),
        )
        for (let plugin of dirs) {
            if (fs.existsSync(path.join(pluginDir, plugin, 'dist')))
                plugin = path.join(plugin, 'dist')
            const meta: PluginMeta['meta'] = require(path.join(pluginDir, plugin, 'package.json'))
            if (!meta.name || !meta.description || !meta['id'] || !meta.version) {
                console.warn(`Plugin ${plugin} is missing a required field.`)
                continue
            }
            pluginMetas.push({
                entry: {
                    server: path.join(pluginDir, plugin, 'server.js'),
                    client: path.join(pluginDir, plugin, 'client.js'),
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
