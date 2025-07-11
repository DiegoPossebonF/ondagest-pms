import { getBookingById } from '@/app/actions/booking/actions'
import { BookingDetails } from '@/components/booking/BookingDetails'
import BookingForm from '@/components/booking/BookingForm'

export default async function BookingId({
  params,
}: { params: { id: string } }) {
  const { id } = await params

  const res = await getBookingById(Number(id))

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <div className="p-6 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="md:basis-1/2">
          <BookingForm bookingData={res.data} />
        </div>
        <div className="flex flex-col md:basis-1/2 gap-4">
          <BookingDetails booking={res.data} />
        </div>
      </div>
    </div>
  )
}
