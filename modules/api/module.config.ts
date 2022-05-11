import { defineConfig, PublishConfig } from '@aviutil-toys/dev-tools'
import path from 'path'

import packageJson from './package.json'

const CONFIG = {
    entryPoints: ['./server/index.ts', './client/index.ts', './root/index.ts'],
    external: Object.keys(packageJson.dependencies),
    bundle: true,
    dts: true,
}

export default defineConfig(
    {
        ...CONFIG,
        outdir: path.join(__dirname, 'dist'),
        format: ['cjs'],
    },
    {
        ...CONFIG,
        outdir: path.join(__dirname, 'dist/esm'),
        format: ['esm'],
        outExtension: {
            '.js': '.js',
        },
    },
)

export const publish: PublishConfig = {
    root: './dist',
}
