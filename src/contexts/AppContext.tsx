// src/contexts/AppContext.tsx
'use client'

import type { Organization, User } from '@prisma/client'
import { createContext, useContext } from 'react'

type AppContextType = {
  user: User
  organization: Organization | null
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx)
    throw new Error('useAppContext deve ser usado dentro de AppProvider')
  return ctx
}

export function AppProvider({
  value,
  children,
}: {
  value: AppContextType
  children: React.ReactNode
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
