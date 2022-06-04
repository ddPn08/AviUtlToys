import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { FilesContext } from '..'
import { CategoriesEditor } from '../components/categories-editor'
import { FileList } from '../components/file-list'
import { FileSelectButton } from '../components/file-select-button'

import { client } from '@/client/context'
import type { AviutilFileSet } from '@/types/files'

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
          <Popover>
            <PopoverTrigger>
              <Button bg="red.300">削除</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>削除します、よろしいですか？</PopoverHeader>
              <PopoverBody>
                <Button
                  bg="red.300"
                  onClick={async () => {
                    await client.invoke('files:delete', previousId)
                    update()
                    navigate('..')
                  }}
                >
                  削除
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </Flex>
      <Divider my="4" />
      <CategoriesEditor fileSet={fileSet} setFileSet={setFileSet} />
      <FileList fileSet={fileSet} setFileSet={setFileSet} editable />
      <FileSelectButton fileSet={fileSet} setFileSet={setFileSet} />
    </>
  )
}
