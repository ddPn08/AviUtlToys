import { ipcApi } from '@aviutil-toys/api/client'
import { Button, Grid } from '@chakra-ui/react'
import { useState } from 'react'

import type { AviutilFile, AviutilFileSet } from '@/types/files'

export const FileSelectButton: React.FC<{
  fileSet: AviutilFileSet
  setFileSet: (fileSet: AviutilFileSet) => void
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

          const newFiles: AviutilFile[] = res.filePaths
            .map(
              (file) =>
                ({
                  type: 'file',
                  dir:
                    fileSet.type === 'plugin'
                      ? '/Plugins'
                      : fileSet.type === 'script'
                      ? '/Scripts'
                      : '/',
                  filename: file.split(/\\|\//).pop()!,
                  origin: file,
                } as AviutilFile),
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

          const newFiles: AviutilFile[] = res.filePaths
            .map(
              (file) =>
                ({
                  type: 'dir',
                  dir:
                    fileSet.type === 'plugin'
                      ? '/Plugins'
                      : fileSet.type === 'script'
                      ? '/Scripts'
                      : '/',
                  filename: file.split(/\\|\//).pop()!,
                  origin: file,
                } as AviutilFile),
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
