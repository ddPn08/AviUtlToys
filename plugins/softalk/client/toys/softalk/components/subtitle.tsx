import { Button, FormControl, Heading, HStack, Input, Stack, Textarea } from '@chakra-ui/react'
import encoding from 'encoding-japanese'
import { useContext, useRef } from 'react'

import { SofTalkContext } from '..'

const loadFileContents = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const buf = e.target?.result as string
      const uniArray = encoding.convert(encoding.stringToCode(buf), 'UNICODE', 'SJIS')
      resolve(encoding.codeToString(uniArray))
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsBinaryString(file)
  })
}

export const SubTitles: React.FC = () => {
  const { subTitle, setSubTitle } = useContext(SofTalkContext)
  const inputFileRef = useRef<HTMLInputElement>(null)

  return (
    <Stack spacing={2} my="2">
      <Heading size="md">字幕を追加</Heading>
      <FormControl as={Stack} spacing={2}>
        <Textarea
          size="lg"
          h="300px"
          fontSize="sm"
          placeholder="字幕のExo"
          value={subTitle}
          onChange={(e) => setSubTitle(e.currentTarget.value)}
        />
      </FormControl>
      <HStack spacing={2}>
        <Button
          onClick={() => {
            inputFileRef.current?.click()
          }}
        >
          ファイルを選択
        </Button>
        <Input
          type="file"
          ref={inputFileRef}
          display="none"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const contents = await loadFileContents(file)
            setSubTitle(contents)
          }}
        />
      </HStack>
    </Stack>
  )
}
