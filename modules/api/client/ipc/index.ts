import type { ClientToServerEvents, ServerToClientEvents } from '../../root/index.js'
import { IpcClient } from './client.js'

export * from './client.js'

export const ipcApi = new IpcClient<ServerToClientEvents, ClientToServerEvents>('api')
