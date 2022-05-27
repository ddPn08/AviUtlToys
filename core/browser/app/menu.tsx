import type { ToyContextType } from '@aviutil-toys/api/client'
import { LinkIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, HStack, VStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { To, useNavigate } from 'react-router-dom'

import { toysAtom, pluginsAtom } from '@/browser/state'

const StyledBox = styled(Box)`
  width: 100%;
  padding: 0 1rem;
`
const NavButton: React.FC<{
  to: To
  label: string
  icon?: React.ReactNode
}> = ({ to, label, icon }) => {
  const navigate = useNavigate()
  return (
    <Button w="100%" variant="ghost" onClick={() => navigate(to)}>
      <HStack width="100%">
        {icon ? (
          icon
        ) : (
          <>
            <LinkIcon />
          </>
        )}
        <Heading size="sm">{label}</Heading>
      </HStack>
    </Button>
  )
}

export const Menu: React.FC<React.ComponentProps<typeof Box>> = ({ ...props }) => {
  const [toys] = useAtom(toysAtom)
  const [plugins] = useAtom(pluginsAtom)
  const grouped: Record<string, ToyContextType[]> = {}
  for (const future of toys) {
    const group = future.parentPlugin || 'system'
    grouped[group] = [...(grouped[group] || []), future]
  }

  return (
    <Box {...props}>
      <StyledBox>
        {Object.keys(grouped).map((group) => {
          const plugin = plugins.find((v) => v.meta['id'] === group)
          const heading = plugin?.meta['name'] || group
          return (
            <VStack key={group} marginTop="5">
              <Heading size="sm">{heading}</Heading>
              {grouped[group]?.map(({ id, title, icon, parentPlugin }, i) => (
                <NavButton
                  key={i}
                  to={`/toys/${parentPlugin ? `${parentPlugin}/` : ''}${id}`}
                  icon={icon}
                  label={title}
                />
              ))}
            </VStack>
          )
        })}
      </StyledBox>
    </Box>
  )
}
