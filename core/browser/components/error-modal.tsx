import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { createContext, useContext, useState } from 'react'

type ShowFn = (title: string, message: string, onClose?: () => void) => void

const ErrorModalContext = createContext((() => {}) as ShowFn)
export const useErrorModal = () => {
  return useContext(ErrorModalContext)
}

export const ErrorModal: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [title, setTitle] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [onCloseFn, setOnClose] = useState<() => () => void>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ErrorModalContext.Provider
      value={(t, m, f) => {
        setTitle(t)
        setMessage(m)
        f && setOnClose(() => f)
        onOpen()
      }}
    >
      {children}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          if (onCloseFn) {
            const f = onCloseFn()
            f && f()
          }
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose()
            }}
          />
          <ModalBody>
            <Text>{message}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ErrorModalContext.Provider>
  )
}
