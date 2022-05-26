import type { Plugin } from 'esbuild'
import fs from 'fs'

import { PluginLoader } from '../../plugin-loader'

// import { isDev } from '@/main'

export const PluginLoaderPlugin: Plugin = {
    name: 'aviutil-toys:plugin-loader',
    setup(build) {
        console.log('Loading plugins...')
        build.onResolve({ filter: new RegExp('^[^.]+$') }, (args) => {
            return {
                path: require.resolve(args.path),
            }
        })
        build.onLoad({ filter: /\.js?$/ }, async (args) => {
            let contents = await fs.promises.readFile(args.path, 'utf8')
            if (contents.includes('document.___LOADPLUGINS___')) {
                const plugins = PluginLoader.pluginMetas
                    .map((v) => `await import('${v.entry.client.replace(/\\/g, '\\\\')}')`)
                    .join(',')
                contents = contents.replace(
                    'document.___LOADPLUGINS___',
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
