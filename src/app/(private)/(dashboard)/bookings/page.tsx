import BookingListFooter from '@/components/booking/BookingListFooter'
import BookingsFilters from '@/components/booking/BookingsFilters'
import { BookingsList } from '@/components/booking/BookingsList'

export default function BookingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>
      <p className="text-muted-foreground mb-6">
        Aqui você pode gerenciar todas as reservas feitas pelos hóspedes.
      </p>
      <div className="flex flex-col space-y-4">
        <BookingsFilters />
        <BookingsList />
        <BookingListFooter />
      </div>
    </div>
  )
}
