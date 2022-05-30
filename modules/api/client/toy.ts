import React, { createContext, useContext } from 'react'

export type ToyContextType = {
    id: string
    title: string
    description: string
    pluginDataPath?: string
    icon?: React.ReactNode
    component: React.FC
    routes?: Record<string, React.FC>
    parentPlugin?: string
    essentialConfig?: string[]
}

export const ToyContext = createContext({} as Omit<ToyContextType, 'component'>)
export const useToyContext = () => useContext(ToyContext)
