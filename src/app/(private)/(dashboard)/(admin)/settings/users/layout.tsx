import { UsersFiltersProvider } from '@/components/user/UsersFiltersProvider'

export default function UsersLayout({
  children,
}: { children: React.ReactNode }) {
  return <UsersFiltersProvider>{children}</UsersFiltersProvider>
}
