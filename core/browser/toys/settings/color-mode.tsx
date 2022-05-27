import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, IconButton, Text, useColorMode } from '@chakra-ui/react'

import { InputItem } from '@/browser/components/input-item'

export const ColorMode: React.FC = () => {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <InputItem
        label={<Text>カラーモード</Text>}
        input={
          <>
            <ButtonGroup>
              <Button
                onClick={() => {
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                  setColorMode(isDark ? 'dark' : 'light')
                }}
              >
                システムの既定値に設定
              </Button>
              <IconButton aria-label="ToggleColorMode" onClick={toggleColorMode}>
                {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </ButtonGroup>
          </>
        }
      />
    </>
  )
}
