import { ApiClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/api'

export const client = new ApiClient<ServerToClientEvents, ClientToServerEvents>('plugin:common')
