import type { ClientToServerEvents, ServerToClientEvents } from '../../root/index.js'
import { ApiClient } from './client.js'

export * from './client.js'

export const api = new ApiClient<ServerToClientEvents, ClientToServerEvents>('api')
