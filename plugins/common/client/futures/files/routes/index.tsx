import { Box, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { FilesContext } from '..'
import { FileSetList } from '../file-set-list'

export const Index = () => {
  const { files } = useContext(FilesContext)
  const navigate = useNavigate()
  return (
    <>
      <Box marginBottom="5">
        <Button
          onClick={() => {
            navigate('./add')
          }}
        >
          追加
        </Button>
      </Box>

      <FileSetList fileSets={files} />
    </>
  )
}
