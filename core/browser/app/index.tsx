import { Box, ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react'
import { css, useTheme, Global } from '@emotion/react'
import { useAtom } from 'jotai'
import { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ErrorModal } from '../components/error-modal'
import { Frame } from './frame'
import { Menu } from './menu'
import { PluginLoader } from './plugin-loader'
import { theme } from './theme'
import { UpdateAlert } from './update-alert'

import { toysAtom } from '@/browser/state'
import { BaseToy } from '@/browser/toys/base-toy'

const GlobalStyles = () => {
  const { colorMode } = useColorMode()
  const theme = useTheme()
  return (
    <Global
      styles={css`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
        }
        #root {
          height: 100vh;
          overflow: hidden;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: ${colorMode === 'dark' ? theme.colors.gray[700] : theme.colors.gray[200]};
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}
    />
  )
}

const Providers: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <HashRouter>
    <PluginLoader />
    <UpdateAlert />
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <ErrorModal>{children}</ErrorModal>
    </ChakraProvider>
  </HashRouter>
)

export const App: React.FC = () => {
  const [toys] = useAtom(toysAtom)

  return (
    <Providers>
      <Box display="grid" gridTemplateColumns="1fr 4fr" gridTemplateRows="31px 1fr" h="100%">
        <Frame gridColumn="1 / 3" />
        <Box gridRow="2 / 3" gridColumn="2 / 3" h="100%" overflowY="auto">
          <Routes>
            {toys.map((toy, i) => (
              <Route
                key={i}
                path={`/toys/${toy.parentPlugin ? `${toy.parentPlugin}/` : ''}${toy.id}/*`}
                element={
                  <Suspense fallback={'loading'}>
                    <BaseToy {...toy} />
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </Box>
        <Menu gridRow="2 / 3" gridColumn="1 / 2" />
      </Box>
    </Providers>
  )
}
