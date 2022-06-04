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
import { css } from '@emotion/react'
import { useAtom } from 'jotai'
import { useContext, useEffect, useState } from 'react'

import { SofTalkContext } from '..'

import { ipc } from '@/client/api'
import { lastPresetAtom } from '@/client/state'
import type { VoicePreset } from '@/types'

const NewPreset: React.FC<
  ReturnType<typeof useDisclosure> & {
    onCreate: () => void
  }
> = ({ onClose, isOpen, onCreate }) => {
  const toast = useToast()
  const { readOptions, subTitle, exoVolume } = useContext(SofTalkContext)
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
                await ipc.invoke('voice:preset:create', {
                  name,
                  readOptions,
                  subTitle,
                  exoVolume,
                })
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

const Preset: React.FC<{
  preset: VoicePreset
  update: () => void
}> = ({ preset, update }) => {
  const { setReadOptions, setSubTitle, setExoVolume } = useContext(SofTalkContext)
  const disclosure = useDisclosure()
  const toast = useToast()
  const [, setLastPreset] = useAtom(lastPresetAtom)
  return (
    <Popover key={preset.name} isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <PopoverTrigger>
        <Button
          onClick={() => {
            setLastPreset(preset)
            setReadOptions(preset.readOptions)
            setSubTitle(preset.subTitle || '')
            setExoVolume(preset.exoVolume || 100)
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            disclosure.onOpen()
          }}
          flex="0 0 auto"
        >
          {preset.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton
          onClick={() => {
            disclosure.onClose()
          }}
        />
        <PopoverBody>
          <ButtonGroup>
            <Button
              bgColor="red.500"
              onClick={async () => {
                await ipc.invoke('voice:preset:delete', preset.name)
                toast({
                  title: '削除しました',
                  status: 'success',
                  isClosable: true,
                })
                update()
                disclosure.onClose()
              }}
            >
              削除
            </Button>
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export const Presets: React.FC = () => {
  const modal = useDisclosure()
  const [presets, setPresets] = useState<VoicePreset[]>([])

  const update = async () => ipc.invoke('voice:preset:list').then(setPresets)
  useEffect(() => {
    update()
  }, [])
  return (
    <Box my="4">
      <Stack spacing={4}>
        <Divider />
        <Heading size="md">プリセット</Heading>
        <HStack
          w="100%"
          overflowX="auto"
          css={css`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          {presets.map((preset) => (
            <Preset key={preset.name} preset={preset} update={update} />
          ))}
          <Button onClick={() => modal.onOpen()}>
            <AddIcon />
          </Button>
        </HStack>
        <Divider />
      </Stack>
      <NewPreset {...modal} onCreate={() => update()} />
    </Box>
  )
}
