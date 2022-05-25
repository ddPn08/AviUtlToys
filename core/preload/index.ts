// eslint-disable-next-line unused-imports/no-unused-imports
import type * as _ from '@aviutil-toys/api/client/preload'
import { ipcRenderer } from 'electron'

window['ipcRenderer'] = ipcRenderer
window['ready'] = true
