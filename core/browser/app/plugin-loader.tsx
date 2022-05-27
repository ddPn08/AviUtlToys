import type { ClientPlugin } from '@aviutil-toys/api/client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import React from 'react'

import { ipcSystem } from '../api/system'
import { Constants } from '../constants'

import { futuresAtom, pluginsAtom } from '@/browser/state'

// eslint-disable-next-line react/display-name
export const PluginLoader = React.memo(() => {
  const [, setPlugins] = useAtom(pluginsAtom)
  const [, setFutures] = useAtom(futuresAtom)

  const update = async () => {
    const plugins = await ipcSystem.invoke('plugin:list')
    const pluginDataList = await Promise.all(
      plugins.map(async (plugin) => {
        const { default: context }: ClientPlugin = await import(plugin.entry)
        return {
          context: await context(),
          meta: plugin.meta,
        }
      }),
    )

    const futures = pluginDataList
      .map((plugin) =>
        plugin.context.futures.map((future) => ({
          ...future,
          parentPlugin: plugin.meta['id'],
        })),
      )
      .flat()
    setPlugins(pluginDataList)
    setFutures([...Constants.futures, ...futures])
  }

  useEffect(() => {
    update()
  }, [])

  return <></>
})
