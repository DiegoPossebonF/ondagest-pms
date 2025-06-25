import { GuestsFiltersProvider } from '@/components/guest/GuestsFiltersProvider'

export default function GuestsLayout({
  children,
}: { children: React.ReactNode }) {
  return <GuestsFiltersProvider>{children}</GuestsFiltersProvider>
}
