import { BookingFiltersProvider } from '@/components/booking/BookingFiltersProvider'

export default function BookingsLayout({
  children,
}: { children: React.ReactNode }) {
  return <BookingFiltersProvider>{children}</BookingFiltersProvider>
}
