import { createPlugin, PluginContext } from '@aviutl-toys/api/server'
import fs from 'fs'

export let Context: PluginContext

export default createPlugin({
    async preInitialization(ctx) {
        Context = ctx
    },
    async postInitialization(ctx) {
        await import('./api')
        if (!fs.existsSync(ctx.dataFolder)) await fs.promises.mkdir(ctx.dataFolder)
    },
})
