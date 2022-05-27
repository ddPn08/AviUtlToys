import { Box, Flex, Spacer, useColorMode } from '@chakra-ui/react'

export const InputItem: React.FC<{
  label: React.ReactNode
  input: React.ReactNode
}> = ({ label, input }) => {
  const { colorMode } = useColorMode()
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderRadius="5"
      padding="1rem"
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
    >
      <Box maxW="50%">{label}</Box>
      <Spacer />
      <Box maxW="50%">{input}</Box>
    </Flex>
  )
}
