import type { ConfigurationType } from '@aviutil-toys/api'
import type { ToyContextType } from '@aviutil-toys/api/client'
import { SettingsIcon } from '@chakra-ui/icons'

import { Settings } from './toys/settings'

type Constants = {
  configuration: {
    keyMap: Record<keyof ConfigurationType, string>
  }
  toys: ToyContextType[]
}
export const Constants: Constants = {
  configuration: {
    keyMap: {
      aviutilDir: 'Aviutilのフォルダ',
      aviutilExec: 'Aviutilの実行ファイル',
    },
  },
  toys: [
    {
      id: 'settings',
      parentPlugin: 'system',
      title: 'Settings',
      description: 'Aviutil Toys は Aviutilをより便利にするユーティリティのセットです。',
      icon: <SettingsIcon />,
      component: Settings,
    },
  ],
}
