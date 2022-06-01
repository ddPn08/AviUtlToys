import { IpcClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/api'

export const client = new IpcClient<ServerToClientEvents, ClientToServerEvents>('plugin:common')
