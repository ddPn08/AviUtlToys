import { createPlugin, PluginContext } from '@aviutil-toys/api/server'

export let Context: PluginContext

export default createPlugin((context) => {
    Context = context
})
