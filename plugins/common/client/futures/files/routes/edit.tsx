import { Button, ButtonGroup, Flex, Heading } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { FilesContext } from '..'
import { FileList } from '../file-list'

import { client } from '@/client/context'
import { AviutilFileSet } from '@/types/files'

export const Edit: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as AviutilFileSet
  const { update } = useContext(FilesContext)
  const [previousId] = useState(state.id)
  const [fileSet, setFileSet] = useState<AviutilFileSet>(state)
  return (
    <>
      <Flex justifyContent="space-between">
        <Heading>{fileSet.id}</Heading>
        <ButtonGroup>
          <Button
            onClick={async () => {
              await client.invoke(fileSet.enabled ? 'files:disable' : 'files:enable', previousId)
              setFileSet((prev) => ({ ...prev, enabled: !prev.enabled }))
            }}
          >
            {fileSet.enabled ? '無効化' : '有効化'}
          </Button>
          <Button
            onClick={async () => {
              await client.invoke('files:update', previousId, fileSet)
              update()
              navigate('..')
            }}
          >
            保存
          </Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              await client.invoke('files:delete', previousId)
              update()
              navigate('..')
            }}
          >
            削除
          </Button>
        </ButtonGroup>
      </Flex>
      <FileList
        fileSet={fileSet}
        editable
        onEditFile={(file, index) => {
          setFileSet({
            ...fileSet,
            files: [...fileSet.files.slice(0, index), file, ...fileSet.files.slice(index + 1)],
          })
        }}
      />
    </>
  )
}
