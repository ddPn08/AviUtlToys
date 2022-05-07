import { defineConfig } from '@aviutil-toys/dev-tools'
import fs from 'fs'
import path from 'path'

if (fs.existsSync(path.join(__dirname, 'dist')))
    fs.rmSync(path.join(__dirname, 'dist'), { recursive: true })

export default defineConfig(
    {
        entriesPattern: 'src/**/*.{ts,tsx}',
        outdir: path.join(__dirname, 'dist'),
        dts: true,
    },
    {
        entryPoints: ['cli/index.ts'],
        outdir: path.join(__dirname, 'dist', 'cli'),
        bundle: true,
        external: ['esbuild'],
        async onEnd() {
            if (!fs.existsSync(path.join(__dirname, 'dist/cli/shims')))
                await fs.promises.mkdir(path.join(__dirname, 'dist/cli/shims'))

            await fs.promises.writeFile(
                path.join(__dirname, 'dist/cli/shims/react.js'),
                `import * as React from 'react'; export { React }`,
            )
        },
    },
)
