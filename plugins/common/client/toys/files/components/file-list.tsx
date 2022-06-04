import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Grid, GridItem, Input, Text, useColorMode } from '@chakra-ui/react'

import type { AviutilFileSet } from '@/types/files'

export const FileList: React.FC<{
  fileSet: AviutilFileSet
  setFileSet: (fileSet: AviutilFileSet) => void
  editable?: boolean
}> = ({ fileSet, setFileSet, editable }) => {
  const { colorMode } = useColorMode()
  return (
    <Box>
      {fileSet.files.map((file, i) => (
        <Grid
          key={file.filename}
          templateColumns="repeat(2, 1fr)"
          p="1rem"
          m="0.5rem"
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        >
          <GridItem>
            <Text color="gray">ファイル名</Text>
          </GridItem>
          <GridItem>
            <Text color="gray">設置場所</Text>
          </GridItem>
          <GridItem>
            <Text>{file.filename}</Text>
            <Text fontSize="xs" color="gray.300">
              {file.type === 'dir' ? 'ディレクトリ' : 'ファイル'}
            </Text>
          </GridItem>
          <GridItem display="flex" gap="2">
            <Input
              size="md"
              value={file.dir}
              disabled={!editable}
              onChange={(e) => {
                file.dir = e.currentTarget.value
                setFileSet({ ...fileSet })
              }}
            />
            <Button
              bg="red.300"
              onClick={() => {
                fileSet.files.splice(i, 1)
                setFileSet({ ...fileSet })
              }}
            >
              <DeleteIcon />
            </Button>
          </GridItem>
        </Grid>
      ))}
    </Box>
  )
}
