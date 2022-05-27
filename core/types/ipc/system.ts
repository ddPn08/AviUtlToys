export interface ServerToClientEvents {}

export interface ClientToServerEvents {
    'plugin:list': () => { entry: string; meta: Record<string, any> }[]
}
