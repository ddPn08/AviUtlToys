import properties from '@aviutl-toys/config/properties.json'
import type { Plugin } from 'esbuild'

const PLUGIN_NAME = 'aviutl-toys:resolver'

const createRegExp = (globals: string[]) => {
    const raw = []
    for (const global of globals) {
        raw.push(`${global}(/.*)*`)
    }
    return new RegExp(raw.join('|'))
}

export const GlobalsResolver: Plugin = {
    name: PLUGIN_NAME,
    setup(build) {
        const filter = new RegExp(createRegExp(properties['client.externals']))
        build.onResolve({ filter }, (args) => {
            if (!properties['client.externals'].includes(args.path)) return
            const contents = `const p=window.___AVIUTL_TOYS_GLOBALS['${args.path}'];module.exports =p`
            return {
                namespace: PLUGIN_NAME,
                path: args.path,
                pluginData: {
                    contents,
                },
            }
        })
        build.onLoad({ filter, namespace: PLUGIN_NAME }, async (args) => {
            return {
                contents: args.pluginData.contents,
                loader: 'js',
            }
        })
    },
}
