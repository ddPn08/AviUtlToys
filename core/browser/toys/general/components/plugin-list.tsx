import { ipcApi } from '@aviutil-toys/api/client'
import { Badge, Box, Heading, HStack, Stack, Text, useColorMode } from '@chakra-ui/react'
import { useAtom } from 'jotai'

import { pluginsAtom } from '@/browser/state'

export const PluginList: React.FC = () => {
  const [plugins] = useAtom(pluginsAtom)
  const { colorMode } = useColorMode()
  return (
    <>
      <Heading size="lg">Plugins</Heading>
      <HStack marginTop="5">
        {plugins.map((v, i) => (
          <Stack
            spacing={1}
            key={i}
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
            padding="5"
            borderRadius="5"
          >
            <Box>
              {v.meta['homepage'] && (
                <Badge
                  borderRadius="full"
                  px="2"
                  cursor="pointer"
                  colorScheme="cyan"
                  onClick={() => {
                    ipcApi.invoke('shell:open-external', v.meta['homepage'])
                  }}
                >
                  HomePage
                </Badge>
              )}
            </Box>
            <Text color="gray.500" letterSpacing="wide" fontSize="xs">
              {v.meta['version']}
            </Text>
            <Heading size="md" fontWeight="semibold">
              {v.meta['name']}
            </Heading>
            <Text fontSize="sm">{v.meta['id']}</Text>
          </Stack>
        ))}
      </HStack>
    </>
  )
}
