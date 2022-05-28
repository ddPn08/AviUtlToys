import { server } from '..'

import { FileManager } from '@/server/files/manager'

server.handle('files:add', (_, files) => {
    return FileManager.add(files)
})
server.handle('files:delete', (_, id) => {
    return FileManager.remove(id)
})
server.handle('files:disable', (_, id) => {
    return FileManager.disable(id)
})
server.handle('files:enable', (_, id) => {
    return FileManager.enable(id)
})
server.handle('files:get', (_, id) => {
    return FileManager.get(id)
})
server.handle('files:list', () => {
    return FileManager.filesList
})
server.handle('files:update', (_, id, file) => {
    return FileManager.update(id, file)
})
