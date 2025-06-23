import { BookingsFiltersProvider } from '@/components/booking/BookingsFiltersProvider'

export default function BookingsLayout({
  children,
}: { children: React.ReactNode }) {
  return <BookingsFiltersProvider>{children}</BookingsFiltersProvider>
}
