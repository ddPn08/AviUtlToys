import type { ClientPlugin } from '@aviutl-toys/api/client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { ipcSystem } from '@/browser/api/system'
import { Constants } from '@/browser/constants'
import { pluginsAtom, toysAtom } from '@/browser/state'

export const usePluginLoader = () => {
  const [, setPlugins] = useAtom(pluginsAtom)
  const [, setToys] = useAtom(toysAtom)

  const update = async () => {
    const plugins = await ipcSystem.invoke('plugin:list')
    const pluginDataList = await Promise.all(
      plugins.map(async (plugin) => {
        const { default: context }: ClientPlugin = await import(plugin.entry.client)
        return {
          context: await context(),
          meta: plugin.meta,
        }
      }),
    )

    const toys = pluginDataList
      .map((plugin) =>
        plugin.context.toys.map((toy) => ({
          ...toy,
          pluginDataPath: plugin.meta['pluginDataPath'],
          parentPlugin: plugin.meta['id'],
        })),
      )
      .flat()
    setPlugins(pluginDataList)
    setToys([...Constants.toys, ...toys])
  }

  useEffect(() => {
    update()
  }, [])
}
