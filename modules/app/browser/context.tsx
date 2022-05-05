import { FutureContextType } from '@aviutil-toys/api/client'
import { SettingsIcon } from '@chakra-ui/icons'

import { Settings } from './futures/settings'

export type Context = {
  futures: FutureContextType[]
}
export const Context: Context = {
  futures: [
    {
      id: 'settings',
      title: 'Settings',
      description: 'Aviutil Toys は Aviutilをより便利にするユーティリティのセットです。',
      icon: <SettingsIcon />,
      component: Settings,
    },
  ],
}
