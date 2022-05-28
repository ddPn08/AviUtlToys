import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'

import { SofTalkContext } from '..'

import { ipc } from '@/client/api'
import type { VoicePreset } from '@/types'

const NewPreset: React.FC<
  ReturnType<typeof useDisclosure> & {
    onCreate: () => void
  }
> = ({ onClose, isOpen, onCreate }) => {
  const toast = useToast()
  const { readOptions } = useContext(SofTalkContext)
  const [name, setName] = useState('')
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>プリセットを保存</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Stack spacing={4}>
            <Input
              placeholder="名前"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <Button
              onClick={async () => {
                await ipc.invoke('voice:preset:create', { name, readOptions })
                onClose()
                onCreate()
                toast({
                  title: '保存しました',
                  status: 'success',
                  isClosable: true,
                })
              }}
            >
              保存
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const Presets: React.FC = () => {
  const { setReadOptions } = useContext(SofTalkContext)
  const modal = useDisclosure()
  const popover = useDisclosure()
  const toast = useToast()
  const [presets, setPresets] = useState<VoicePreset[]>([])
  const reload = async () => {
    const presets = await ipc.invoke('voice:preset:list')
    setPresets(presets)
  }
  useEffect(() => {
    reload()
  }, [])
  return (
    <Box my="4">
      <Stack spacing={4}>
        <Divider />
        <Heading size="md">プリセット</Heading>
        <Divider />
        <HStack>
          {presets.map((preset) => (
            <Popover key={preset.name} isOpen={popover.isOpen}>
              <PopoverTrigger>
                <Button onClick={popover.onOpen}>{preset.name}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        setReadOptions(preset.readOptions)
                        popover.onClose()
                      }}
                    >
                      読み込む
                    </Button>
                    <Button
                      bgColor="red.500"
                      onClick={async () => {
                        await ipc.invoke('voice:preset:delete', preset.name)
                        toast({
                          title: '削除しました',
                          status: 'success',
                          isClosable: true,
                        })
                        reload()
                      }}
                    >
                      削除
                    </Button>
                  </ButtonGroup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ))}
          <Button onClick={() => modal.onOpen()}>
            <AddIcon />
          </Button>
        </HStack>
        <Divider />
      </Stack>
      <NewPreset {...modal} onCreate={() => reload()} />
    </Box>
  )
}
