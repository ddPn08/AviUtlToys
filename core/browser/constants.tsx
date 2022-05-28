import type { ConfigurationType } from '@aviutil-toys/api'
import type { ToyContextType } from '@aviutil-toys/api/client'
import { SettingsIcon } from '@chakra-ui/icons'

import { Settings } from './toys/general'

type Constants = {
  configuration: {
    keyMap: Record<keyof ConfigurationType, string>
  }
  links: { name: string; url: string }[]
  toys: ToyContextType[]
}
export const Constants: Constants = {
  configuration: {
    keyMap: {
      aviutilDir: 'Aviutilのフォルダ',
      aviutilExec: 'Aviutilの実行ファイル',
    },
  },
  links: [
    {
      name: 'GitHubリポジトリ',
      url: 'https://github.com/ddpn08/aviutil-toys',
    },
    {
      name: 'バグを報告',
      url: 'https://github.com/ddPn08/aviutil-toys/issues/new',
    }
  ],
  toys: [
    {
      id: 'general',
      parentPlugin: 'system',
      title: 'General',
      description: '',
      icon: <SettingsIcon />,
      component: Settings,
    },
  ],
}
