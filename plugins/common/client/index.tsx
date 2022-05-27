import { createPlugin } from '@aviutil-toys/api/client'

import { Exos } from './toys/exos'
import { Files } from './toys/files'

export default createPlugin(async () => {
  return {
    toys: [
      {
        id: 'Exos',
        title: 'Exos',
        description: 'Exoファイルを管理できます。',
        component: () => <Exos />,
      },
      {
        id: 'Files',
        title: 'Files',
        description: 'ファイルを管理できます。プラグインやスクリプトの有効無効の管理等に使えます。',
        component: () => <Files />,
        essentialConfig: ['aviutilDir'],
      },
    ],
  }
})
