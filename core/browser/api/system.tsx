import { ApiClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipcSystem = new ApiClient<ServerToClientEvents, ClientToServerEvents>('system')
