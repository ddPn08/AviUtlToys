import { defineConfig, PublishConfig } from '@aviutil-toys/dev-tools'
import fs from 'fs'
import path from 'path'

export default defineConfig({
    entryPoints: ['src/index.ts'],
    outdir: path.join(__dirname, 'dist'),
    format: ['cjs'],
    bundle: true,
    external: ['esbuild'],
    async onStart() {
        if (fs.existsSync(path.join(__dirname, 'dist')))
            await fs.promises.rm(path.join(__dirname, 'dist'), { recursive: true })
    },
    async onEnd() {
        if (!fs.existsSync(path.join(__dirname, 'dist/shims')))
            await fs.promises.mkdir(path.join(__dirname, 'dist/shims'))

        await fs.promises.writeFile(
            path.join(__dirname, 'dist/shims/react.js'),
            `import * as React from 'react'; export { React }`,
        )
    },
})

export const publish: PublishConfig = {
    root: '.'
}
