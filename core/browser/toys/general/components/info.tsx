import { api } from '@aviutil-toys/api/client'
import Icon from '@aviutil-toys/assets/image/icon.svg'
import { Flex, HStack, Link, Stack, Text, useColorMode } from '@chakra-ui/react'

import packageJson from '../../../../package.json'

import { Constants } from '@/browser/constants'

export const Info: React.FC = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex alignItems="center" gap="4">
      <Icon width={100} height={100} />
      <Stack spacing={2} color={colorMode === 'dark' ? 'gray.300' : 'black'}>
        <Text fontSize="xs">Aviutil Toys v{packageJson.version}</Text>
        <Text fontSize="sm">
          Aviutil Toys は Aviutilをより便利にするユーティリティのセットです。
          <br />
          プラグインの管理や、ゆっくりボイスの生成、Exoファイルの管理など、様々な便利ツールが揃っています。
        </Text>
        <HStack color="aqua">
          {Constants.links.map(({ name, url }) => (
            <Link
              key={url}
              onClick={() => {
                api.invoke('shell:open-external', url)
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
