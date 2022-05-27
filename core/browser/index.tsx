import React from 'react'
import ReactDOM from 'react-dom/client'

import '@aviutil-toys/api/client'
import { App } from './app'

window.___AVIUTIL_TOYS_GLOBALS = {}
/** @LOAD_GLOBALS */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
