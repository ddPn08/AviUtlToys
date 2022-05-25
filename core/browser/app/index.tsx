import {
  Box,
  ChakraProvider,
  Heading,
  Spinner,
  ColorModeScript,
  useTheme,
  useColorMode,
} from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { useAtom } from 'jotai'
import { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ErrorModal } from '../components/error-modal'
import { Frame } from './frame'
import { Menu } from './menu'
import { PluginLoader } from './plugin-loader'
import { theme } from './theme'

import { BaseFuture } from '@/browser/futures/base-future'
import { futuresAtom } from '@/browser/state'

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

const ContextSuspender: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  if (!window.ready)
    throw new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (!window.ready) return
        clearInterval(timer)
        resolve()
      }, 500)
    })
  return <>{children}</>
}

const LoadingFallback: React.FC<React.ComponentProps<typeof Box>> = (props) => {
  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      gap="1rem"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <Heading>Loading...</Heading>
      <Spinner size="xl" />
    </Box>
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
  const [futures] = useAtom(futuresAtom)

  return (
    <Providers>
      <Box display="grid" gridTemplateColumns="1fr 4fr" gridTemplateRows="31px 1fr" h="100%">
        <Frame gridColumn="1 / 3" />
        <Suspense fallback={<LoadingFallback gridColumn="1 / 3" />}>
          <ContextSuspender />
          <PluginLoader />

          <Box gridColumn="2 / 3" h="100%" overflowY="auto">
            <Routes>
              {futures.map((future, i) => (
                <Route
                  key={i}
                  path={`/futures/${future.parentPlugin ? `${future.parentPlugin}/` : ''}${
                    future.id
                  }/*`}
                  element={
                    <Suspense fallback={'loading'}>
                      <BaseFuture {...future} />
                    </Suspense>
                  }
                />
              ))}
            </Routes>
          </Box>
          <Menu gridRow="2 / 3" gridColumn="1 / 2" />
        </Suspense>
      </Box>
    </Providers>
  )
}
