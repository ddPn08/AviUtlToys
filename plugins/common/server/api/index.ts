import { IpcServer } from '@aviutl-toys/api/server'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/api'

export const server = new IpcServer<ServerToClientEvents, ClientToServerEvents>('plugin:common')
import('./registers')
