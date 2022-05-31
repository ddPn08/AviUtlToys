export type AviutilFileType = 'plugin' | 'script' | 'other'

export type AviutilFile = {
    type: 'file' | 'dir'
    dir: string
    filename: string
    origin?: string
}

export type AviutilFileSet = {
    id: string
    enabled?: boolean
    type: AviutilFileType
    files: AviutilFile[]
}
