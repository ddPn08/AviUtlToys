import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(path.dirname(import.meta.url))

const cwd = path.join(__dirname, '../')

const packageJson = JSON.parse(await fs.promises.readFile(path.join(cwd, 'package.json'), 'utf8'))
const publishTempDir = path.join('node_modules', '.publish')

if (fs.existsSync(publishTempDir)) await fs.promises.rm(publishTempDir, { recursive: true })
await fs.promises.mkdir(publishTempDir, { recursive: true })

const root = path.join(cwd, 'dist')

if (!fs.existsSync(root)) {
    console.error(`Publish root ${root} not exists`)
    process.exit(0)
}
if (packageJson.publishConfig) {
    for (const key in packageJson.publishConfig) {
        packageJson[key] = packageJson.publishConfig[key]
        delete packageJson.publishConfig[key]
    }
    if (Object.keys(packageJson.publishConfig).length === 0) delete packageJson.publishConfig
}
await fs.promises.writeFile(
    path.join(publishTempDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
)

await fs.promises.cp(root, publishTempDir, { recursive: true })
await fs.promises.writeFile(path.join(publishTempDir, 'yarn.lock'), '')

spawnSync('yarn', { cwd: publishTempDir, stdio: 'inherit' })
const result = spawnSync('yarn', ['npm', 'publish', '--access', 'public'], {
    cwd: publishTempDir,
    stdio: 'inherit',
})

if (result.status !== 0) {
    console.error(`Publish failed`)
} else {
    console.log(`Publish success`)
}

await fs.promises.rm(publishTempDir, { recursive: true })
