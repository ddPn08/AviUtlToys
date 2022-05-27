import { EXO } from '@aviutil/exo'
import fs from 'fs'
import iconv from 'iconv-lite'
import path from 'path'

import { server } from '..'
import { EXOManager } from '../../exo/manager'

import { Context } from '@/server/context'

server.handle('exos:add', async (_, id, displayName, filepath) => {
    const contents = await fs.promises.readFile(filepath)
    const str = iconv.decode(contents, 'shift_jis')
    const exo = EXO.parse(str).toJSON()

    EXOManager.add({
        id,
        displayName,
        exo,
    })
})
server.handle('exos:get', (_, id) => {
    return EXOManager.get(id)
})
server.handle('exos:list', () => {
    return EXOManager.exos
})
server.handle('exos:create', (_, exo) => {
    EXOManager.add(exo)
})
server.handle('exos:update', (_, id, exo) => {
    EXOManager.update(id, exo)
})
server.handle('exos:delete', (_, id) => {
    EXOManager.remove(id)
})
server.handle('exos:drag', async (e, id) => {
    const exo = EXOManager.get(id)
    if (!exo) throw new Error(`Exo ${id} does not exist`)
    const str = EXO.parse(exo.exo).toString()
    const contents = iconv.encode(str, 'shift_jis')
    const filepath = path.join(Context.dataFolder, 'exos', `temp.exo`)
    if (!fs.existsSync(path.dirname(filepath))) await fs.promises.mkdir(path.dirname(filepath))

    await fs.promises.writeFile(filepath, contents)
    e.sender.startDrag({
        file: filepath,
        icon: require.resolve('@aviutil-toys/assets/image/drag-and-drop.png'),
    })
})
