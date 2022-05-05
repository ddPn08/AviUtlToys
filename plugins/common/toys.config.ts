import { defineConfig } from '@aviutil-toys/plugin-sdk'

export default defineConfig({
    server: {
        entry: './server/index.ts',
        esbuild: {
            external: ['@aviutil-toys/assets'],
        },
    },
    client: {
        entry: './client/index.tsx',
    },
})
