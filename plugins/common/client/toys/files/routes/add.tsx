import {
  Box,
  Button,
  ButtonGroup,
  Text,
  Input,
  Stack,
  Tooltip,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FilesContext } from '..'
import { FileList } from '../components/file-list'
import { FileSelectButton } from '../components/file-select-button'

import { client } from '@/client/context'
import type { AviutilFileSet } from '@/types/files'

export const Add: React.FC = () => {
  const navigate = useNavigate()
  const { update } = useContext(FilesContext)
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [fileSet, setFileSet] = useState<AviutilFileSet>({
    id: '',
    type: 'plugin',
    files: [],
  })

  return (
    <>
      <Box>
        <FormControl>
          <Stack spacing={2}>
            <FormLabel>ID</FormLabel>
            <Tooltip
              label="ファイルを識別する際に使用されます。"
              hasArrow
              arrowSize={15}
              openDelay={500}
            >
              <Input
                placeholder="ID"
                value={fileSet.id}
                onChange={(e) =>
                  setFileSet({
                    ...fileSet,
                    id: e.target.value,
                  })
                }
              />
            </Tooltip>

            <FormLabel>タイプ</FormLabel>
            <ButtonGroup>
              {(['plugin', 'script', 'other'] as const).map((type) => {
                return (
                  <Button
                    key={type}
                    disabled={fileSet.type === type}
                    onClick={() => {
                      setFileSet({
                        ...fileSet,
                        type,
                      })
                    }}
                  >
                    {type.toUpperCase()}
                  </Button>
                )
              })}
            </ButtonGroup>
            <FileSelectButton fileSet={fileSet} setFileSet={setFileSet} />
            <FileList fileSet={fileSet} setFileSet={setFileSet} editable />
          </Stack>
        </FormControl>
        <Button
          isLoading={isLoading}
          onClick={async () => {
            if (!fileSet.id) return setError('IDを入力してください。')
            if (!fileSet.files.length) return setError('ファイルを選択してください。')
            setIsLoading(true)
            await client.invoke('files:add', fileSet)
            update()
            setIsLoading(false)
            navigate('..')
          }}
        >
          追加
        </Button>
        {error && <Text color="red.300">{error}</Text>}
      </Box>
    </>
  )
}
