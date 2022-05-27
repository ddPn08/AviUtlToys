import { ToyContext, ToyContextType } from '@aviutil-toys/api/client'
import { Box, Heading, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'

const FutureContainerInner = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 1rem;
`
export const ToyContainer: React.FC<React.PropsWithChildren<Omit<ToyContextType, 'component'>>> = (
  context,
) => {
  return (
    <ToyContext.Provider value={context}>
      <FutureContainerInner>
        <Heading as="h2" margin="1rem" fontWeight="semibold">
          {context.title}
        </Heading>
        <Text>{context.description}</Text>
        <Box padding="1rem">{context.children}</Box>
      </FutureContainerInner>
    </ToyContext.Provider>
  )
}
