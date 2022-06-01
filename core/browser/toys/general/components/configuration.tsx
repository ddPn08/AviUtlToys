import { ipcApi } from '@aviutil-toys/api/client'
import { Input, InputGroup, InputRightAddon, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useEffect } from 'react'

import { InputItem } from '@/browser/components/input-item'

export const Configuration: React.FC = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [aviutilDir, setAviutilDir] = useState('')
  const [aviutilExec, setAviutilExec] = useState('')
  const effect = async () => {
    const config = await ipcApi.invoke('config:get')
    setAviutilDir(config.aviutilDir || '')
    setAviutilExec(config.aviutilExec || '')
  }

  useEffect(() => {
    effect()
  }, [])
  return (
    <>
      <Stack>
        <InputItem
          label={<Text>Aviutilのフォルダ</Text>}
          input={
            <InputGroup>
              <Input value={aviutilDir} readOnly />
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
                  setAviutilDir(res.filePaths[0]!)

                  const config = await ipcApi.invoke('config:get')
                  config.aviutilDir = res.filePaths[0]!
                  await ipcApi.invoke('config:update', config)
                }}
              >
                参照
              </InputRightAddon>
            </InputGroup>
          }
        />
        <InputItem
          label={<Text>Aviutilの実行ファイル</Text>}
          input={
            <InputGroup>
              <Input value={aviutilExec} readOnly />
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
                  setAviutilExec(res.filePaths[0]!)

                  const config = await ipcApi.invoke('config:get')
                  config.aviutilExec = res.filePaths[0]!
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
