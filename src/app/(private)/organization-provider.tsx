import { OrganizationProvider } from '@/components/organization/OrganizationProvider'
import type { ReactNode } from 'react'
import { getOrganization } from '../actions/organization/actions'
import { getImageBase64 } from '../actions/utils/getImageBase64'

export default async function OrganizationServerProvider({
  children,
}: {
  children: ReactNode
}) {
  const res = await getOrganization()

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  const logoBase64 = res.data.logoUrl
    ? await getImageBase64(res.data.logoUrl)
    : null

  return (
    <OrganizationProvider organization={res.data} logoBase64={logoBase64}>
      {children}
    </OrganizationProvider>
  )
}
