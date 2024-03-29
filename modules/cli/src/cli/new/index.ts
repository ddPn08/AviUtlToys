import degit from 'degit'
import Enquirer from 'enquirer'
import fs from 'fs'
import { bold, cyan, gray, green, red } from 'kleur/colors'
import path from 'path'
import replace from 'replace-in-file'

import { TEMPLATES } from './templates'
import type { NewProjectOptions } from './types'

const POST_PROCESS_FILES = ['package.json']

export const run = async (options: NewProjectOptions) => {
    const officialTemplatesPath = 'ddpn08/AviUtlToys/plugin-templates'

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
            choices: TEMPLATES.map((template) => template.title),
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
        : `${officialTemplatesPath}/${TEMPLATES.find((t) => t.title === template)!.value}`

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

    if (name !== 'aviutl-toys-plugin' && !template.includes('/')) {
        await Promise.all(
            POST_PROCESS_FILES.map(async (file) => {
                const filepath = path.resolve(path.join(name, file))

                if (fs.existsSync(filepath)) {
                    try {
                        replace.sync({
                            files: filepath,
                            from: /aviutl-toys-plugin/g,
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

    let i = 1

    const relative = path.relative(process.cwd(), name)
    if (relative !== '') {
        console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`)
    }

    console.log(`  ${i++}: ${bold(cyan('npm install'))} (or pnpm install, yarn, etc)`)
}
