import { DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Tooltip,
  IconButton,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ButtonGroup,
  useColorMode,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'

import { ExosContext } from '.'

import { client } from '@/client/context'
import type { ExoMeta } from '@/types/exos'

export const ExoDraggable: React.FC<{
  exo: ExoMeta
}> = ({ exo }) => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { update } = useContext(ExosContext)
  const [dragging, setDragging] = useState(false)
  return (
    <>
      <Tooltip
        label="拡張編集にドラッグアンドドロップします。"
        hasArrow
        arrowSize={15}
        openDelay={1000}
      >
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="space-between"
          textAlign="left"
          padding="5"
          width="25%"
          borderRadius="5"
          bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
          filter={dragging ? 'brightness(0.8)' : 'brightness(1)'}
          draggable
          onDragStart={(e) => {
            e.preventDefault()
            client.invoke('exos:drag', exo.id)
            setDragging(true)
          }}
          onMouseLeave={(e) => {
            if (e.button === 0) setDragging(false)
          }}
        >
          <Heading as="h4" size="lg" userSelect="none">
            {exo.displayName}
          </Heading>
          <IconButton aria-label="delete" size="lg" onClick={onOpen}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Tooltip>

      {/* Modals */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {exo.displayName}
            を削除します。よろしいですか？
          </ModalHeader>
          <ModalFooter>
            <ButtonGroup>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await client.invoke('exos:delete', exo.id)
                  update()
                  onClose()
                }}
              >
                削除
              </Button>
              <Button variant="ghost" onClick={onClose}>
                キャンセル
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
