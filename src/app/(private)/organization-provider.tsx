import { OrganizationProvider } from '@/components/organization/OrganizationProvider'
import type { ReactNode } from 'react'
import { getOrganization } from '../actions/organization/actions'

export default async function OrganizationServerProvider({
  children,
}: {
  children: ReactNode
}) {
  const res = await getOrganization()

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <OrganizationProvider organization={res.data}>
      {children}
    </OrganizationProvider>
  )
}
