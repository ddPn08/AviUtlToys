import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { Context } from '../context'

import { futuresAtom, pluginsAtom } from '@/browser/state'

export const PluginLoader: React.FC = () => {
  const [, setPlugins] = useAtom(pluginsAtom)
  const [, setFutures] = useAtom(futuresAtom)

  const update = async () => {
    const pluginDataList = await Promise.all(
      window.plugins.map(async (v) => ({
        context: await v.default(),
        meta: v.meta,
      })),
    )
    const futures = pluginDataList
      .map((v) =>
        v.context.futures.map((v2) => ({
          ...v2,
          parentPlugin: v.meta['id'],
        })),
      )
      .flat()
    setPlugins(pluginDataList.map((v) => v.context))
    setFutures([...Context.futures, ...futures])
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.plugins])

  return <></>
}
