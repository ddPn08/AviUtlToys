import { createPlugin, PluginContext } from '@aviutl-toys/api/server'

export let Context: PluginContext

export default createPlugin((context) => {
    Context = context
})
