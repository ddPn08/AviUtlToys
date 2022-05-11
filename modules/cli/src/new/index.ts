import degit from 'degit'
import Enquirer from 'enquirer'
import fs from 'fs'
import { bold, gray, green, red } from 'kleur/colors'
import path from 'path'
import replace from 'replace-in-file'

import { TEMPLATES } from './templates'
import type { NewProjectOptions } from './types'

const POST_PROCESS_FILES = ['package.json']

export const run = async (options: NewProjectOptions) => {
    const officialTemplatesPath = 'ddpn08/aviutil-toys/plugin-templates'

    const { name, template }: { name: string; template: string } = await Enquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name',
            initial: options.name,
        },
        {
            type: 'select',
            name: 'template',
            message: 'Which template would you like to use?',
            choices: TEMPLATES.map((v) => v.title),
        },
    ])

    if (fs.existsSync(name)) {
        if ((await fs.promises.readdir(name)).length > 0) {
            const { forceOverwrite }: { forceOverwrite: boolean } = await Enquirer.prompt({
                type: 'confirm',
                name: 'forceOverwrite',
                message: 'Directory not empty. Continue [force overwrite]?',
                initial: false,
            })
            if (!forceOverwrite) {
                process.exit(1)
            }
            await fs.promises.rm(name, { recursive: true })
            await fs.promises.mkdir(name)
        }
    } else {
        await fs.promises.mkdir(name)
    }

    const templateTarget = template.includes('/')
        ? template
        : `${officialTemplatesPath}/${template}`

    const emitter = degit(`${templateTarget}`, {
        cache: false,
        force: true,
        verbose: true,
    })

    try {
        console.log(`${green(`>`)} ${gray(`Copying project files...`)}`)
        await emitter.clone(name)
    } catch (error: any) {
        console.error(red(error.message))
        process.exit(1)
    }

    if (name !== 'aviutil-toys-plugin' && !template.includes('/')) {
        await Promise.all(
            POST_PROCESS_FILES.map(async (file) => {
                const filepath = path.resolve(path.join(name, file))

                if (fs.existsSync(filepath)) {
                    try {
                        replace.sync({
                            files: filepath,
                            from: /aviutil-toys-plugin/g,
                            to: name,
                        })
                    } catch (err) {
                        console.error('Error occurred:', err)
                    }
                }
            }),
        )
    }

    console.log(bold(green('🍡') + ' Done! Go!'))
}
