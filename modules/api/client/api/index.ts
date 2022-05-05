import type { ClientToServerEvents, ServerToClientEvents } from '../../root'
import { ApiClient } from './client'

export * from './client'

export const api = new ApiClient<ServerToClientEvents, ClientToServerEvents>('api')
