import { definePluginConfig } from '@aviutil-toys/cli'

export default definePluginConfig({
    server: {
        entry: './server/index.ts',
    },
    client: {
        entry: './client/index.tsx',
    },
})
