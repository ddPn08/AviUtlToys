import { ipcApi } from '@aviutl-toys/api/client'
import Icon from '@aviutl-toys/assets/image/icon.svg'
import { Flex, HStack, Link, Stack, Text, useColorMode } from '@chakra-ui/react'

import packageJson from '../../../../package.json'

import { Constants } from '@/browser/constants'

export const Info: React.FC = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex alignItems="center" gap="4">
      <Icon width={100} height={100} />
      <Stack spacing={2} color={colorMode === 'dark' ? 'gray.300' : 'black'}>
        <Text fontSize="xs">AviUtlToys v{packageJson.version}</Text>
        <Text fontSize="sm">
          AviUtl Toys は AviUtlをより便利にするユーティリティのセットです。
          <br />
          プラグインの管理や、ゆっくりボイスの生成、Exoファイルの管理など、様々な便利ツールが揃っています。
        </Text>
        <HStack color="aqua">
          {Constants.links.map(({ name, url }) => (
            <Link
              key={url}
              onClick={() => {
                ipcApi.invoke('shell:open-external', url)
              }}
            >
              {name}
            </Link>
          ))}
        </HStack>
      </Stack>
    </Flex>
  )
}
