import { BookingsList } from '@/components/booking/BookingsList'

export default function BookingsPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reservas</h1>
        <p className="text-muted-foreground">
          Aqui você pode gerenciar todas as reservas feitas pelos hóspedes.
        </p>
      </div>
      <div className="flex flex-col">
        <BookingsList />
      </div>
    </>
  )
}
