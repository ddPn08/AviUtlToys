import { Input, FormLabel, HStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useState } from 'react'

import type { AviutilFileSet } from '@/types/files'

export const CategoriesEditor: React.FC<{
  fileSet: AviutilFileSet
  setFileSet: (fileSet: AviutilFileSet) => void
}> = ({ fileSet, setFileSet }) => {
  const [category, setCategory] = useState<string | undefined>()
  return (
    <>
      <FormLabel>カテゴリ</FormLabel>
      <HStack>
        <Input
          placeholder="plugin, script, etc..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && category) {
              setCategory('')
              if (fileSet.categories.includes(category)) return
              setFileSet({
                ...fileSet,
                categories: [...fileSet.categories, category],
              })
            }
          }}
          w="20%"
        />
        <HStack
          spacing={2}
          w="100%"
          overflow="auto"
          css={css`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          {fileSet.categories.map((category, i) => (
            <Tag key={i} flex="0 0 auto">
              <TagLabel>{category}</TagLabel>
              <TagCloseButton
                onClick={() => {
                  setFileSet({
                    ...fileSet,
                    categories: fileSet.categories.filter((c) => c !== category),
                  })
                }}
              />
            </Tag>
          ))}
        </HStack>
      </HStack>
    </>
  )
}
