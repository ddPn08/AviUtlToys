import { createPlugin } from '@aviutil-toys/api/client'

import { HelloWorld } from './futures'

export default createPlugin(async () => {
  return {
    futures: [
      {
        id: 'helloworld',
        title: 'Hello World',
        description: 'Hello World',
        component: () => <HelloWorld />,
      },
    ],
  }
})
