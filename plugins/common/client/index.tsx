import { createPlugin } from '@aviutl-toys/api/client'

import { Exos } from './toys/exos'
import { Files } from './toys/files'

export default createPlugin(async () => {
  return {
    toys: [
      {
        id: 'Exos',
        title: 'Exos',
        description:
          'Exoファイルを管理できます。ドラッグアンドドロップでAviUtlに読み込ませられます。',
        component: () => <Exos />,
      },
      {
        id: 'Files',
        title: 'Files',
        description: 'ファイルを管理できます。プラグインやスクリプトの管理等に使えます。',
        component: () => <Files />,
        essentialConfig: ['aviutlDir'],
      },
    ],
  }
})
