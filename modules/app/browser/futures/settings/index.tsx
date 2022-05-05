import { Box } from '@chakra-ui/react'

import { ColorMode } from './color-mode'
import { Configuration } from './configuration'
import { PluginList } from './plugin-list'

export const Settings: React.FC = () => {
  return (
    <>
      <Box margin="5">
        <ColorMode />
      </Box>
      <Box margin="5">
        <Configuration />
      </Box>
      <Box margin="5">
        <PluginList />
      </Box>
    </>
  )
}
