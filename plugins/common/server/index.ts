import { createPlugin } from '@aviutil-toys/api/server'

import { Context } from './context'

export default createPlugin({
    preInitialization(ctx) {
        Context.dataFolder = ctx.dataFolder
        Context.meta = ctx.meta
    },
    async postInitialization() {
        await import('./api')
    },
})
