import { ipcApi } from '@aviutl-toys/api/client'
import { Button, Grid } from '@chakra-ui/react'
import { useState } from 'react'

import type { AviUtlFile, AviUtlFileSet } from '@/types/files'

export const FileSelectButton: React.FC<{
  fileSet: AviUtlFileSet
  setFileSet: (fileSet: AviUtlFileSet) => void
}> = ({ fileSet, setFileSet }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="2">
      <Button
        cursor="pointer"
        onClick={async () => {
          if (dialogIsOpen) return
          setDialogIsOpen(true)
          const res = await ipcApi.invoke('native:show-open-dialog', {
            properties: ['openFile', 'multiSelections'],
          })
          setDialogIsOpen(false)
          if (res.canceled) return

          const newFiles: AviUtlFile[] = res.filePaths
            .map(
              (file) =>
                ({
                  type: 'file',
                  dir: '/',
                  filename: file.split(/\\|\//).pop()!,
                  origin: file,
                } as AviUtlFile),
            )
            .filter(
              (file) =>
                !fileSet.files.some((f) => f.filename === file.filename && f.dir === file.dir),
            )

          setFileSet({
            ...fileSet,
            files: [...fileSet.files, ...newFiles],
          })
        }}
      >
        ファイルを選択
      </Button>
      <Button
        cursor="pointer"
        onClick={async () => {
          if (dialogIsOpen) return
          setDialogIsOpen(true)
          const res = await ipcApi.invoke('native:show-open-dialog', {
            properties: ['openFile', 'openDirectory', 'multiSelections'],
          })
          setDialogIsOpen(false)
          if (res.canceled) return

          const newFiles: AviUtlFile[] = res.filePaths
            .map(
              (file) =>
                ({
                  type: 'dir',
                  dir: '/',
                  filename: file.split(/\\|\//).pop()!,
                  origin: file,
                } as AviUtlFile),
            )
            .filter(
              (file) =>
                !fileSet.files.some((f) => f.filename === file.filename && f.dir === file.dir),
            )

          setFileSet({
            ...fileSet,
            files: [...fileSet.files, ...newFiles],
          })
        }}
      >
        フォルダを選択
      </Button>
    </Grid>
  )
}
