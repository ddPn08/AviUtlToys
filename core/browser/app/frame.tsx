import { ipcApi } from '@aviutl-toys/api/client'
import { Box, Button, ButtonGroup, Heading, useColorMode } from '@chakra-ui/react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { VscChromeClose, VscChromeMinimize, VscChromeMaximize } from 'react-icons/vsc'

const StyledButton = styled(Button)`
  border-radius: 0;
  height: 31px;
  aspect-ratio: 1.5;
  :focus {
    box-shadow: none;
  }
`
const FrameButton: React.FC<{
  'aria-label': string
  label: React.ReactNode
  onClick: () => void
}> = ({ label, ...rest }) => {
  return (
    <StyledButton variant="ghost" {...rest}>
      {label}
    </StyledButton>
  )
}

export const Frame: React.FC<React.ComponentProps<typeof Box>> = ({ ...props }) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gridTemplateRows="1fr auto"
      w="100%"
      css={
        colorMode === 'light'
          ? css`
              background-color: whitesmoke;
              color: black;
              -webkit-app-region: drag;
            `
          : css`
              background-color: black;
              color: whitesmoke;
              -webkit-app-region: drag;
            `
      }
      {...props}
    >
      <Box p="2">
        <Heading size="sm">AviUtlToys</Heading>
      </Box>
      <ButtonGroup
        size="md"
        isAttached
        variant="outline"
        css={css`
          -webkit-app-region: no-drag;
        `}
      >
        <FrameButton
          aria-label="minimize"
          label={<VscChromeMinimize />}
          onClick={() => ipcApi.invoke('window:minimize')}
        />
        <FrameButton
          aria-label="maximize"
          label={<VscChromeMaximize />}
          onClick={() => ipcApi.invoke('window:toggleMaximize')}
        />
        <FrameButton
          aria-label="close"
          label={<VscChromeClose />}
          onClick={() => ipcApi.invoke('window:close')}
        />
      </ButtonGroup>
    </Box>
  )
}
