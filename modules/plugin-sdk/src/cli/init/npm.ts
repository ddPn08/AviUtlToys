import { spawn } from 'child_process'

export const getNpmAgent = () => {
    const agent = process.env['npm_config_user_agent']
    if (agent && agent.includes('yarn')) return 'yarn'
    return 'npm'
}
export const add = (modules: string[], args: string[] = []) => {
    return new Promise<void>((resolve, reject) => {
        const agent = getNpmAgent()
        if (modules.length === 0) resolve()
        if (agent === 'npm') args.push('--save')
        const ps = spawn(
            agent,
            agent === 'npm' ? ['install', ...args, ...modules] : ['add', ...args, ...modules],
            {
                cwd: process.cwd(),
                stdio: 'inherit',
            },
        )
        ps.on('close', (code) => {
            if (code === 0) return resolve()
            reject(new Error(`npm install failed with code ${code}`))
        })
    })
}
export const addDev = async (modules: string[]) => {
    const agent = getNpmAgent()
    await add(modules, [agent === 'npm' ? '--save-dev' : '--dev'])
}
