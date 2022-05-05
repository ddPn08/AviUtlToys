import { Button, useDisclosure } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { useState, useEffect, createContext } from 'react'

import { client } from '../../context'
import { Add } from './add'
import { ExoList } from './exo-list'

import { ExoMeta } from '@/types/exos'

export const ExosContext = createContext<{
  update: () => void
}>({ update() {} })

export const Exos: React.FC = () => {
  const {
    isOpen: addModalIsOpen,
    onOpen: addModalOnOpen,
    onClose: addModalOnClose,
  } = useDisclosure()
  const [exos, setExos] = useState<ExoMeta[]>([])

  const update = async () => {
    setExos(await client.invoke('exos:list'))
  }

  useEffect(() => {
    update()
  }, [])

  return (
    <ExosContext.Provider
      value={{
        update,
      }}
    >
      <Box marginBottom="5">
        <Button onClick={addModalOnOpen}>追加</Button>
      </Box>
      <ExoList exos={exos} />

      {/* Modals */}
      <Add isOpen={addModalIsOpen} onClose={addModalOnClose} />
    </ExosContext.Provider>
  )
}
