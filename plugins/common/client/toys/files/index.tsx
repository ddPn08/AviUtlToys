import { api } from '@aviutil-toys/api/client'
import { createContext, useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { Index } from './routes'
import { Add } from './routes/add'
import { Edit } from './routes/edit'

import { client } from '@/client/context'
import type { AviutilFileSet } from '@/types/files'

export const FilesContext = createContext<{
  update: () => void
  files: AviutilFileSet[]
}>({ update() {}, files: [] })

export const Files = () => {
  const [fileSets, setFileSets] = useState<AviutilFileSet[]>([])

  const update = () => {
    client.invoke('files:list').then(setFileSets)
  }

  useEffect(() => {
    update()
  }, [])

  return (
    <FilesContext.Provider value={{ update, files: fileSets }}>
      <Routes>
        <Route index element={<Index />} />
        <Route path="add" element={<Add />} />
        <Route path="edit" element={<Edit />} />
      </Routes>
      <Outlet />
    </FilesContext.Provider>
  )
}

api.once('config:update', (_) => {
  client.invoke('files:reload')
})
