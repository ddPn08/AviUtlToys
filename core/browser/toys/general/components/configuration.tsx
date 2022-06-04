import { ipcApi } from '@aviutl-toys/api/client'
import { Input, InputGroup, InputRightAddon, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useEffect } from 'react'

import { InputItem } from '@/browser/components/input-item'

export const Configuration: React.FC = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [aviutlDir, setAviUtlDir] = useState('')
  const [aviutlExec, setAviUtlExec] = useState('')
  const effect = async () => {
    const config = await ipcApi.invoke('config:get')
    setAviUtlDir(config.aviutlDir || '')
    setAviUtlExec(config.aviutlExec || '')
  }

  useEffect(() => {
    effect()
  }, [])
  return (
    <>
      <Stack>
        <InputItem
          label={<Text>AviUtlのフォルダ</Text>}
          input={
            <InputGroup>
              <Input value={aviutlDir} readOnly />
              <InputRightAddon
                cursor="pointer"
                onClick={async () => {
                  if (dialogIsOpen) return
                  setDialogIsOpen(true)
                  const res = await ipcApi.invoke('native:show-open-dialog', {
                    properties: ['openDirectory'],
                  })
                  setDialogIsOpen(false)
                  if (res.canceled) return
                  setAviUtlDir(res.filePaths[0]!)

                  const config = await ipcApi.invoke('config:get')
                  config.aviutlDir = res.filePaths[0]!
                  await ipcApi.invoke('config:update', config)
                }}
              >
                参照
              </InputRightAddon>
            </InputGroup>
          }
        />
        <InputItem
          label={<Text>AviUtlの実行ファイル</Text>}
          input={
            <InputGroup>
              <Input value={aviutlExec} readOnly />
              <InputRightAddon
                cursor="pointer"
                onClick={async () => {
                  if (dialogIsOpen) return
                  setDialogIsOpen(true)
                  const res = await ipcApi.invoke('native:show-open-dialog', {
                    properties: ['openFile'],
                    filters: [
                      {
                        name: 'exe',
                        extensions: ['exe'],
                      },
                    ],
                  })
                  setDialogIsOpen(false)
                  if (res.canceled) return
                  setAviUtlExec(res.filePaths[0]!)

                  const config = await ipcApi.invoke('config:get')
                  config.aviutlExec = res.filePaths[0]!
                  await ipcApi.invoke('config:update', config)
                }}
              >
                参照
              </InputRightAddon>
            </InputGroup>
          }
        />
      </Stack>
    </>
  )
}
