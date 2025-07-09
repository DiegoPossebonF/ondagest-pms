import { RatesFiltersProvider } from '@/components/rate/RatesFiltersProvider'

export default function RatesLayout({
  children,
}: { children: React.ReactNode }) {
  return <RatesFiltersProvider>{children}</RatesFiltersProvider>
}
