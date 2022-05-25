import { extendTheme, type Theme } from '@chakra-ui/react'

const config: Partial<Theme> = {
  fonts: {
    heading: 'Segoe UI, Yu Gothic UI',
    body: 'Segoe UI, Yu Gothic UI',
    mono: 'Segoe UI, Yu Gothic UI',
  },
  config: {
    initialColorMode:
      (localStorage.getItem('chakra-ui-color-mode') as 'dark') || 'light' || 'system' || 'light',
  },
}

export const theme = extendTheme(config) as Theme
