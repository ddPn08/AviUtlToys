import { ApiClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipc = new ApiClient<ServerToClientEvents, ClientToServerEvents>(
  'system:plugin:softalk',
)
