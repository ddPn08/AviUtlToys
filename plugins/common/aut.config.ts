import { definePluginConfig } from '@aviutil-toys/api'

export default definePluginConfig({
    server: {
        entry: './server/index.ts',
        esbuild: {
            external: ['@aviutil-toys/assets'],
            minify: true,
        },
    },
    client: {
        entry: './client/index.tsx',
        esbuild: {
            minify: true,
        },
    },
})
