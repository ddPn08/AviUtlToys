import { build, CliOptions } from 'electron-builder'
import path from 'path'

import { getAllDependencies } from '../../util/dependencies'
import { NODE_MODULES } from '../../util/node_modules'

const cwd = path.join(__dirname, '../../../../../core')

export const buildApplication = async () => {
    const modules = new Set(await getAllDependencies('@aviutil-toys/app'))
    modules.delete('@aviutil-toys/app')

    const options: CliOptions = {
        config: {
            appId: 'world.ddpn.aviutil-toys',
            productName: 'aviutil-toys',
            artifactName: '${productName}-${version}.${ext}',
            copyright: 'Copyright © 2022 ddPn08',
            icon: require.resolve('@aviutil-toys/assets/image/icon.png'),
            directories: { app: cwd, output: path.join(cwd, 'product') },
            win: {
                target: [
                    {
                        target: 'nsis',
                        arch: 'x64',
                    },
                ],
            },
            compression: 'store',
            files: ['dist/**/*', ...Array.from(modules).map((v) => `${NODE_MODULES}/${v}`)],
            asar: false,
        },
    }

    await build(options)
}
