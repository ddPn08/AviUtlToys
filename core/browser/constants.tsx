import type { ConfigurationType } from '@aviutl-toys/api'
import type { ToyContextType } from '@aviutl-toys/api/client'
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
      aviutlDir: 'AviUtlのフォルダ',
      aviutlExec: 'AviUtlの実行ファイル',
    },
  },
  links: [
    {
      name: 'GitHubリポジトリ',
      url: 'https://github.com/ddpn08/AviUtlToys',
    },
    {
      name: 'バグを報告',
      url: 'https://github.com/ddpn08/AviUtlToys/issues/new',
    },
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
