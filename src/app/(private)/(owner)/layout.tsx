import { getUserAndOrg } from '@/app/actions/utils/get-user-and-org'
import { AppProvider } from '@/contexts/AppContext'
import { redirect } from 'next/navigation'

export default async function SettingsLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await getUserAndOrg()
  if (!user) redirect('/signin')

  // Aqui não redirecionamos se não houver organização
  return (
    <AppProvider value={{ user, organization: user.organization }}>
      {children}
    </AppProvider>
  )
}
