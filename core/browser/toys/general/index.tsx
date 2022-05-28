import { Box, Stack } from '@chakra-ui/react'

import { ColorMode } from './components/color-mode'
import { Configuration } from './components/configuration'
import { Info } from './components/info'
import { PluginList } from './components/plugin-list'
import { RunAviutil } from './components/run-aviutil'

export const Settings: React.FC = () => {
  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Info />
        </Box>
        <Box>
          <ColorMode />
        </Box>
        <Box>
          <Configuration />
        </Box>
        <Box>
          <RunAviutil />
        </Box>
        <Box>
          <PluginList />
        </Box>
      </Stack>
    </>
  )
}
