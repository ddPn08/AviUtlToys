import { server } from '..'

import { FileManager } from '@/server/files/manager'

server.handle('files:reload', () => FileManager.load())
server.handle('files:add', (_, files) => FileManager.add(files))
server.handle('files:delete', (_, id) => FileManager.delete(id))
server.handle('files:disable', (_, id) => FileManager.disable(id))
server.handle('files:enable', (_, id) => FileManager.enable(id))
server.handle('files:get', (_, id) => FileManager.get(id))
server.handle('files:list', () => FileManager.filesList)
server.handle('files:update', (_, id, file) => FileManager.update(id, file))
