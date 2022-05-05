import React, { createContext, useContext } from 'react'

export type FutureContextType = {
    id: string
    title: string
    description: string
    icon?: React.ReactNode
    component: React.FC
    routes?: Record<string, React.FC>
    parentPlugin?: string
    essentialConfig?: string[]
}

export const FutureContext = createContext({} as Omit<FutureContextType, 'component'>)
export const useFutureContext = () => useContext(FutureContext)
