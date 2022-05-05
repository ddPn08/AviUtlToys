import type { Plugin } from 'esbuild'
import fs from 'fs'

import { PluginLoader } from '../../plugin-loader'

import { isDev } from '@/main'

export const LoadPlugins: Plugin = {
    name: 'plugin loader',
    setup(build) {
        console.log('Loading plugins...')
        build.onResolve({ filter: new RegExp('^[^.]+$') }, (args) => {
            if (!isDev) {
                args.path = args.path.replace(/@aviutil-toys\/api/g, '@aviutil-toys/api/dist')
                if (args.path === '@aviutil-toys/api/dist')
                    args.path = '@aviutil-toys/api/dist/root'
            }
            return {
                path: require.resolve(args.path).replace('app.asar', 'app.asar.unpacked'),
            }
        })
        build.onLoad({ filter: /\.js?$/ }, async (args) => {
            let contents = await fs.promises.readFile(args.path, 'utf8')
            const match = contents.match(/module\.exports\.PLUGIN_LOADER/g)
            if (match) {
                const plugins = PluginLoader.pluginMetas
                    .map((v) => `require('${v.entry.client.replace(/\\/g, '\\\\')}')`)
                    .join(',')
                contents = contents.replace(
                    /module\.exports\.PLUGIN_LOADER/g,
                    `const plugins = [${plugins}]; window['plugins'] = plugins;`,
                )
            }
            return {
                contents,
                loader: 'js',
            }
        })
    },
}