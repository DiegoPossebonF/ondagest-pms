import { getBookingById } from '@/app/actions/booking/actions'
import { BookingDetails } from '@/components/booking/BookingDetails'
import BookingForm from '@/components/booking/BookingForm'

export default async function BookingId({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const res = await getBookingById(Number(id))

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <div className="md:h-[calc(100vh-4rem)] p-6 flex md:flex-row flex-col gap-6">
      <div className="md:basis-1/2">
        <BookingForm bookingData={res.data} />
      </div>
      <div className="md:basis-1/2">
        <BookingDetails booking={res.data} />
      </div>
    </div>
  )
}
