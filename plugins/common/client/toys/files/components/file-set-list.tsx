import { EditIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Switch,
  Tab,
  TabList,
  Tabs,
  useColorMode,
} from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FilesContext } from '..'

import { client } from '@/client/context'
import type { AviutilFileSet } from '@/types/files'

export const FileSetList: React.FC<{
  fileSets: AviutilFileSet[]
}> = ({ fileSets }) => {
  const { update } = useContext(FilesContext)
  const navigate = useNavigate()
  const { colorMode } = useColorMode()
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [togglePending, setTogglePending] = useState(false)
  return (
    <Stack>
      <Tabs>
        <TabList
          w="100%"
          overflow="auto"
          css={css`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          <Tab
            onClick={() => {
              setCategoryFilter(undefined)
            }}
          >
            ALL
          </Tab>
          {fileSets
            .flatMap((fileSet) => fileSet.categories)
            .map((category, i) => (
              <Tab
                key={i}
                onClick={() => {
                  setCategoryFilter(category)
                }}
              >
                <Badge>{category}</Badge>
              </Tab>
            ))}
        </TabList>
      </Tabs>
      {fileSets
        .sort((a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase()))
        .filter((fileSet) => {
          if (!categoryFilter) return true
          return fileSet.categories.includes(categoryFilter)
        })
        .map((file, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <Divider></Divider>}
            <Flex
              alignItems="center"
              gap="1rem"
              p="1rem"
              bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
            >
              <Box flex={1}>
                <Heading size="sm">{file.id}</Heading>
                <Box>
                  {file.categories.map((category, i) => (
                    <Badge key={i} m="0.5">
                      {category}
                    </Badge>
                  ))}
                </Box>
              </Box>
              <HStack>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    navigate('./edit', { state: file })
                  }}
                >
                  <EditIcon />
                </IconButton>
                <Switch
                  defaultChecked={!!file.enabled}
                  disabled={togglePending}
                  onChange={async (e) => {
                    setTogglePending(true)
                    await client.invoke(
                      e.currentTarget.checked ? 'files:enable' : 'files:disable',
                      file.id,
                    )
                    update()
                    setTogglePending(false)
                  }}
                />
              </HStack>
            </Flex>
          </React.Fragment>
        ))}
    </Stack>
  )
}
