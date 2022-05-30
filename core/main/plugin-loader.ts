import type { Plugin } from '@aviutil-toys/api/server'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import { Development } from './development'

import type { PluginMeta } from '@/types'

const PLUGIN_DATA_DIR = path.join(app.getPath('userData'), 'pluginData')

export namespace PluginLoader {
    export const pluginMetaList: PluginMeta[] = []
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
            meta['pluginDataPath'] = path.join(PLUGIN_DATA_DIR, meta['id'])
            pluginMetaList.push({
                entry: {
                    server: path.join(pluginDir, plugin, 'server.js'),
                    client: path.join(pluginDir, plugin, 'client.js'),
                },
                meta,
            })
            Development.addClientWatchFile(path.join(pluginDir, plugin, 'client.js'))
        }
    }
    export const importPlugins = async () => {
        if (!fs.existsSync(PLUGIN_DATA_DIR)) await fs.promises.mkdir(PLUGIN_DATA_DIR)

        for (const pluginMeta of pluginMetaList) {
            const plugin: Plugin = require(pluginMeta.entry.server)
            const dataFolder = path.join(PLUGIN_DATA_DIR, pluginMeta.meta['id'])
            if (!fs.existsSync(dataFolder)) await fs.promises.mkdir(dataFolder)
            plugin.default({
                dataFolder,
                meta: pluginMeta.meta,
            })
            plugins.push(plugin)
        }
    }
}
