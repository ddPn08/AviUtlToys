import React from 'react'
import ReactDOM from 'react-dom/client'

import '@aviutl-toys/api/client'
import { App } from './app'

window.___AVIUTL_TOYS_GLOBALS = {}
/** @LOAD_GLOBALS */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
