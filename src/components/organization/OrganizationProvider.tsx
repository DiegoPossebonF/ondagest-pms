'use client'
import type { Organization } from '@/app/generated/prisma'
import { createContext, useContext } from 'react'

const OrganizationContext = createContext<Organization | undefined>(undefined)

export function OrganizationProvider({
  organization,
  children,
}: {
  organization: Organization
  children: React.ReactNode
}) {
  return (
    <OrganizationContext.Provider value={organization}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error(
      'useOrganization deve ser usado dentro de OrganizationProvider'
    )
  }
  return context
}
