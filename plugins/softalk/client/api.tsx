import { IpcClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipc = new IpcClient<ServerToClientEvents, ClientToServerEvents>(
  'system:plugin:softalk',
)
