import { createPlugin, PluginContext } from '@aviutil-toys/api/server'
import fs from 'fs'

export let Context: PluginContext

export default createPlugin(async (context) => {
    Context = context
    await import('./api')
    if (!fs.existsSync(context.dataFolder)) await fs.promises.mkdir(context.dataFolder)
})
