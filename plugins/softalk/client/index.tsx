import { createPlugin } from '@aviutl-toys/api/client'

import { SofTalk } from './toys/softalk'

export default createPlugin(async () => {
  return {
    toys: [
      {
        id: 'softalk',
        title: 'SofTalk',
        description: 'SofTalkを使ってゆっくり音声を合成し、AviUtlに読み込ませます。',
        component: () => <SofTalk />,
      },
    ],
  }
})
