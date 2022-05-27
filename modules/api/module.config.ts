import { defineConfig, ModuleConfig, PublishConfig } from '@aviutil-toys/dev-tools'
import path from 'path'

const config: ModuleConfig = {
    entryPoints: ['./server/index.ts', './client/index.ts', './root/index.ts'],
    bundle: true,
    dts: true,
}

export default defineConfig(
    {
        ...config,
        outdir: path.join(__dirname, 'dist'),
        format: ['cjs'],
    },
    {
        ...config,
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
