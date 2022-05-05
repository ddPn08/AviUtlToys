import { api } from '@aviutil-toys/api/client'
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

import { client } from '@/client/context'
import { AviutilFileType } from '@/types/files'

export const Add: React.FC = () => {
  const navigate = useNavigate()
  const { update } = useContext(FilesContext)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [id, setId] = useState('')
  const [dir, setDir] = useState('')
  const [type, setType] = useState<AviutilFileType>('plugin')
  const [files, setFiles] = useState<string[]>([])

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
              <Input placeholder="ID" value={id} onChange={(e) => setId(e.currentTarget.value)} />
            </Tooltip>

            <FormLabel>設置場所</FormLabel>
            <Tooltip
              label="ファイルを設置する場所を指定します。"
              hasArrow
              arrowSize={15}
              openDelay={500}
            >
              <Input
                placeholder="/Plugins"
                value={dir}
                onChange={(e) => setDir(e.currentTarget.value)}
              />
            </Tooltip>

            <FormLabel>タイプ</FormLabel>
            <ButtonGroup>
              <Button disabled={type === 'plugin'} onClick={() => setType('plugin')}>
                Plugin
              </Button>
              <Button disabled={type === 'script'} onClick={() => setType('script')}>
                Script
              </Button>
              <Button disabled={type === 'other'} onClick={() => setType('other')}>
                Other
              </Button>
            </ButtonGroup>
            <Button
              cursor="pointer"
              onClick={async () => {
                if (dialogIsOpen) return
                setDialogIsOpen(true)
                const res = await api.invoke('native:show-open-dialog', {
                  properties: ['openFile', 'multiSelections'],
                })
                setDialogIsOpen(false)
                if (res.canceled) return
                setFiles(res.filePaths)
              }}
            >
              ファイルを選択
            </Button>
            <Box>
              {files.map((file, i) => (
                <Box key={i}>{file}</Box>
              ))}
            </Box>
          </Stack>
        </FormControl>
        <Button
          onClick={async () => {
            if (!id) return setError('IDを入力してください。')
            if (!dir) return setError('設置場所を入力してください。')
            if (!files.length) return setError('ファイルを選択してください。')
            await client.invoke('files:add', id, type, dir, files)
            update()
            navigate('..')
          }}
        >
          追加
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </Box>
    </>
  )
}
