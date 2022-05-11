import { createPlugin } from '@aviutil-toys/api/client'

import { Exos } from './futures/exos'
import { Files } from './futures/files'

export default createPlugin(async () => {
  return {
    futures: [
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
