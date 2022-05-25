import { ConfigurationType } from '@aviutil-toys/api'
import { FutureContextType } from '@aviutil-toys/api/client'
import { SettingsIcon } from '@chakra-ui/icons'

import { Settings } from './futures/settings'

type Constants = {
  configuration: {
    keyMap: Record<keyof ConfigurationType, string>
  }
  futures: FutureContextType[]
}
export const Constants: Constants = {
  configuration: {
    keyMap: {
      aviutilDir: 'Aviutilのフォルダ',
    },
  },
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
