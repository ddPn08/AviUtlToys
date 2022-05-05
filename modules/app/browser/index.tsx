import React from 'react'
import ReactDOM from 'react-dom/client'
import '@aviutil-toys/api/client'

import { App } from './app'

module.exports.PLUGIN_LOADER

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
