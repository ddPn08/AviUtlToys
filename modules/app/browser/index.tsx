import React from 'react'
import ReactDOM from 'react-dom/client'
import '@aviutil-toys/api/client'

import { App } from './app'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
document.___LOADPLUGINS___

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
