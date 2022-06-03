import { defineConfig } from '@aviutil-toys/dev-tools'
import fs from 'fs'
import path from 'path'

export default defineConfig(
    {
        entryPoints: ['src/cli/index.ts'],
        outdir: path.join(__dirname, 'dist/cli'),
        format: ['cjs'],
        internal: ['@aviutil-toys/config', '@aviutil-toys/assets'],
        async onStart() {
            if (fs.existsSync(path.join(__dirname, 'dist')))
                await fs.promises.rm(path.join(__dirname, 'dist'), { recursive: true })
        },
        async onEnd() {
            if (!fs.existsSync(path.join(__dirname, 'dist/cli/shims')))
                await fs.promises.mkdir(path.join(__dirname, 'dist/cli/shims'))

            await fs.promises.writeFile(
                path.join(__dirname, 'dist/cli/shims/react.js'),
                `import { jsx } from '@emotion/react';import React, { Fragment } from 'react';export { React, jsx, Fragment }`,
            )
        },
    },
    {
        entryPoints: ['src/common/index.ts'],
        outdir: path.join(__dirname, 'dist'),
        format: ['cjs'],
        dts: true,
    },
)
