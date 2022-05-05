import { ApiServer } from '@aviutil-toys/api/server'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/api'

export const server = new ApiServer<ServerToClientEvents, ClientToServerEvents>('plugin:common')
import('./registers')
