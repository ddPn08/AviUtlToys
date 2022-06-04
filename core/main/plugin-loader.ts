import { AviUtlToys, PluginModule } from '@aviutl-toys/api/server'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import { Development } from './development'

import type { PluginMeta } from '@/types'

const PLUGIN_DATA_DIR = path.join(app.getPath('userData'), 'pluginData')

class PluginLoaderClass {
    public plugins: PluginModule[] = []
    public readonly pluginMetaList: PluginMeta[] = []

    public async preLoadPlugins(pluginDir: string) {
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

            const meta: PluginMeta['meta'] = JSON.parse(
                await fs.promises.readFile(path.join(pluginDir, plugin, 'package.json'), 'utf8'),
            )
            if (!meta.name || !meta.description || !meta.version || !meta['id']) {
                console.warn(`Plugin ${plugin} is missing a required field.`)
                continue
            }
            meta['pluginDataPath'] = path.join(PLUGIN_DATA_DIR, meta['id'])
            this.pluginMetaList.push({
                entry: {
                    server: path.join(pluginDir, plugin, 'server.js'),
                    client: path.join(pluginDir, plugin, 'client.js'),
                },
                meta,
            })
            Development.addClientWatchFile(path.join(pluginDir, plugin, 'client.js'))
        }
    }

    public async loadPlugins() {
        if (!fs.existsSync(PLUGIN_DATA_DIR)) await fs.promises.mkdir(PLUGIN_DATA_DIR)

        for (const pluginMeta of this.pluginMetaList) {
            const dataFolder = path.join(PLUGIN_DATA_DIR, pluginMeta.meta['id'])
            if (!fs.existsSync(dataFolder)) await fs.promises.mkdir(dataFolder)
            AviUtlToys.plugins.registerPlugin({
                context: {
                    dataFolder,
                    meta: pluginMeta.meta,
                },
                default: require(pluginMeta.entry.server).default,
            })
        }
    }
}

export const PluginLoader = new PluginLoaderClass()
