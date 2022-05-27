import { api } from '@aviutil-toys/api/client'
import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'

import { ExosContext } from '.'

import { client } from '@/client/context'

export const Add: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { update } = useContext(ExosContext)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [id, setId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [file, setFile] = useState('')
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ファイルを選択</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Stack spacing={2}>
              <Tooltip
                label="Exoを識別する際に使用されます。"
                hasArrow
                arrowSize={15}
                openDelay={500}
              >
                <Input placeholder="ID" value={id} onChange={(e) => setId(e.currentTarget.value)} />
              </Tooltip>
              <Tooltip label="UIに表示される名前です。" hasArrow arrowSize={15} openDelay={500}>
                <Input
                  placeholder="表示名"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.currentTarget.value)}
                />
              </Tooltip>
              <InputGroup>
                <Input readOnly placeholder="C:/aviutil/text.exo" value={file} />
                <InputRightAddon
                  cursor="pointer"
                  onClick={async () => {
                    if (dialogIsOpen) return
                    setDialogIsOpen(true)
                    const res = await api.invoke('native:show-open-dialog', {
                      properties: ['openFile'],
                      filters: [
                        {
                          name: 'Exo',
                          extensions: ['exo'],
                        },
                      ],
                    })
                    setDialogIsOpen(false)
                    if (res.canceled) return
                    setFile(res.filePaths[0]!)
                  }}
                >
                  参照
                </InputRightAddon>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={async () => {
                await client.invoke('exos:add', id, displayName, file)
                update()
                onClose()
              }}
            >
              追加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
