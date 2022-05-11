import { definePluginConfig } from '@aviutil-toys/api'

export default definePluginConfig({
    server: {
        entry: './server/index.ts',
    },
    client: {
        entry: './client/index.tsx',
    },
})
