import { EditIcon } from '@chakra-ui/icons'
import { Divider, Flex, IconButton, Stack, Switch, Text, useColorMode } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FilesContext } from '.'

import { client } from '@/client/context'
import { AviutilFileSet } from '@/types/files'

export const FileSetList: React.FC<{
  fileSets: AviutilFileSet[]
}> = ({ fileSets }) => {
  const { update } = useContext(FilesContext)
  const navigate = useNavigate()
  const { colorMode } = useColorMode()
  const [togglePending, setTogglePending] = useState(false)
  return (
    <Stack>
      {fileSets.map((file, i) => (
        <React.Fragment key={i}>
          {i !== 0 && <Divider></Divider>}
          <Flex
            alignItems="center"
            gap="1rem"
            p="1rem"
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          >
            <Text size="md" flex={1}>
              {file.id}
            </Text>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate('./edit', { state: file })
              }}
            >
              <EditIcon />
            </IconButton>
            <Switch
              defaultChecked={file.enabled}
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
          </Flex>
        </React.Fragment>
      ))}
    </Stack>
  )
}
