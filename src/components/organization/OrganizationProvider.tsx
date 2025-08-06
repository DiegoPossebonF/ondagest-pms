'use client'
import type { Organization } from '@prisma/client'
import { createContext, useContext } from 'react'

type OrganizationContextProps = {
  organization: Organization
  logoBase64: string | null
}

const OrganizationContext = createContext<OrganizationContextProps | undefined>(
  undefined
)

export function OrganizationProvider({
  organization,
  logoBase64,
  children,
}: {
  organization: Organization
  logoBase64: string | null
  children: React.ReactNode
}) {
  return (
    <OrganizationContext.Provider value={{ organization, logoBase64 }}>
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
