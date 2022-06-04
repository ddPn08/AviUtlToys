import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { useAtom } from 'jotai'
import { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ErrorModal } from '../components/error-modal'
import { Frame } from './frame'
import { usePluginLoader } from './hooks/plugin-loader'
import { useUpdateAlert } from './hooks/update-alert'
import { Menu } from './menu'
import { theme } from './theme'

import { toysAtom } from '@/browser/state'
import { BaseToy } from '@/browser/toys/base-toy'

const GlobalStyles = () => {
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
          background-color: inherit;
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background-color: inherit;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #babac0;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-button {
          display: none;
        }
      `}
    />
  )
}

const Providers: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <HashRouter>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <ErrorModal>{children}</ErrorModal>
    </ChakraProvider>
  </HashRouter>
)

export const App: React.FC = () => {
  const [toys] = useAtom(toysAtom)
  usePluginLoader()
  useUpdateAlert()

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
