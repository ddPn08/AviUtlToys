import { createPlugin } from '@aviutil-toys/api/server'

import { Context } from './context'

export default createPlugin((c) => {
    Context.dataFolder = c.dataFolder
    Context.meta = c.meta
    import('./api')
})
