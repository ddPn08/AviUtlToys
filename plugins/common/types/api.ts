import type { ExoMeta } from './exos'
import type { AviUtlFileSet } from './files'

export type ServerToClientEvents = {}
export type ClientToServerEvents = {
    'exos:add': (id: string, displayName: string, filepath: string) => void
    'exos:get': (id: string) => ExoMeta | undefined
    'exos:list': () => ExoMeta[]
    'exos:create': (exo: ExoMeta) => void
    'exos:update': (id: string, exo: ExoMeta) => void
    'exos:delete': (id: string) => void
    'exos:drag': (id: string) => void

    'files:reload': () => void
    'files:add': (files: AviUtlFileSet) => void
    'files:get': (id: string) => AviUtlFileSet | undefined
    'files:list': () => AviUtlFileSet[]
    'files:update': (id: string, file: AviUtlFileSet) => void
    'files:delete': (id: string) => void
    'files:disable': (id: string) => void
    'files:enable': (id: string) => void
}
