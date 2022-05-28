import { Box, Grid, GridItem, Input, Text, useColorMode } from '@chakra-ui/react'

import type { AviutilFile } from '@/types/files'

export const FileList: React.FC<{
  files: AviutilFile[]
  editable?: boolean
  onEditFile?: (file: AviutilFile, index: number) => void
}> = ({ files, editable, onEditFile }) => {
  const { colorMode } = useColorMode()
  return (
    <Box>
      {files.map((file, i) => (
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
          </GridItem>
          <GridItem>
            <Input
              size="md"
              value={file.dir}
              disabled={!editable}
              onChange={(e) => {
                onEditFile && onEditFile({ ...file, dir: e.target.value }, i)
              }}
            />
          </GridItem>
        </Grid>
      ))}
    </Box>
  )
}
