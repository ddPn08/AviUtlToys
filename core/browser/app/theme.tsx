import { extendTheme, Theme as ChakraTheme } from '@chakra-ui/react'

declare module '@emotion/react' {
  export interface Theme extends ChakraTheme {}
}

const config: Partial<ChakraTheme> = {
  fonts: {
    heading: 'Segoe UI, Yu Gothic UI',
    body: 'Segoe UI, Yu Gothic UI',
    mono: 'Segoe UI, Yu Gothic UI',
  },
  config: {
    initialColorMode: (localStorage.getItem('chakra-ui-color-mode') as 'dark') || 'dark',
  },
}

export const theme = extendTheme(config) as ChakraTheme
