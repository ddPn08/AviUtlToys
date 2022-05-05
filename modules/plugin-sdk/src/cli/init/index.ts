import fs from 'fs'
import kleur from 'kleur'
import path from 'path'

import * as NPM from './npm'

const DEPENDENCIES = [
    '@chakra-ui/react',
    '@emotion/react@^11',
    '@emotion/styled@^11',
    'framer-motion@^6',
]
const DEV_DEPEENDENCIES = ['@tsconfig/node16-strictest-esm', '@tsconfig/vite-react', 'typescript']

export const run = async () => {
    const root = process.cwd()
    const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))

    fs.mkdirSync(path.join(root, 'client'))
    fs.mkdirSync(path.join(root, 'server'))
    const { scripts, ...rest } = packageJson
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(
            {
                ...rest,
                scripts: {
                    build: 'aviutil-toys build',
                    ...scripts,
                },
                plugin: {
                    id: 'com.example.plugin',
                    name: 'MyAviutilToysPlugin',
                    description: 'My Aviutil Toys Plugin',
                },
            },
            null,
            4,
        ),
    )
    fs.writeFileSync(
        path.join(root, 'tsconfig.json'),
        JSON.stringify(
            {
                extends: '@tsconfig/vite-react',
                include: ['client/**/*'],
            },
            null,
            4,
        ),
    )
    fs.writeFileSync(
        path.join(root, 'tsconfig.node.json'),
        JSON.stringify(
            {
                extends: '@tsconfig/node16-strictest-esm',
                compilerOptions: {
                    moduleResolution: 'node',
                },
                include: ['server/**/*'],
            },
            null,
            4,
        ),
    )
    fs.writeFileSync(
        path.join(root, 'toys.config.ts'),
        `import { defineConfig } from '@aviutil-toys/plugin-sdk'
        
export default defineConfig({
    main: {
        server: './server/index.ts',
        client: './client/index.ts',
    },
})
`,
    )

    fs.writeFileSync(path.join(root, 'server', 'index.ts'), ``)
    fs.writeFileSync(path.join(root, 'client', 'index.tsx'), ``)

    console.log(kleur.cyan('Installing dependencies...'))
    await NPM.add(DEPENDENCIES)
    await NPM.addDev(DEV_DEPEENDENCIES)

    console.log(kleur.green('Done!'))
}
