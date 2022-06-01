import { IpcClient } from '@aviutil-toys/api/client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

export const ipcSystem = new IpcClient<ServerToClientEvents, ClientToServerEvents>('system')
