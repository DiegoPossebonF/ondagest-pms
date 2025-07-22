import { OrganizationProvider } from '@/components/organization/OrganizationProvider'
import { fetchImageAsBase64 } from '@/utils/imageBase64'
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

  if (!res.data.logoUrl) {
    return (
      <OrganizationProvider organization={res.data}>
        {children}
      </OrganizationProvider>
    )
  }

  const logoBase64 = await fetchImageAsBase64(res.data.logoUrl || '')

  res.data.logoUrl = logoBase64

  return (
    <OrganizationProvider organization={res.data}>
      {children}
    </OrganizationProvider>
  )
}
