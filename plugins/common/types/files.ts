export type AviUtlFile = {
    type: 'file' | 'dir'
    dir: string
    filename: string
    origin?: string
}

export type AviUtlFileSet = {
    id: string
    enabled?: boolean
    files: AviUtlFile[]
    categories: string[]
}
