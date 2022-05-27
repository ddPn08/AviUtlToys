import { api } from '@aviutil-toys/api/client'
import { Input, InputGroup, InputRightAddon, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useEffect } from 'react'

import { InputItem } from '@/browser/components/input-item'

export const Configuration: React.FC = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [aviutilDir, setAviutilDir] = useState('')
  const effect = async () => {
    const config = await api.invoke('config:get')
    setAviutilDir(config.aviutilDir || '')
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
                  const res = await api.invoke('native:show-open-dialog', {
                    properties: ['openDirectory'],
                  })
                  setDialogIsOpen(false)
                  if (res.canceled) return
                  setAviutilDir(res.filePaths[0]!)

                  const config = await api.invoke('config:get')
                  config.aviutilDir = res.filePaths[0]!
                  await api.invoke('config:update', config)
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
