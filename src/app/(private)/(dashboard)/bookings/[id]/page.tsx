import { getBookingById } from '@/app/actions/booking/actions'
import BookingForm from '@/components/booking/BookingForm'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'

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
        <div className="md:basis-3/5">
          <BookingForm bookingData={res.data} />
        </div>
        <div className="flex flex-col md:basis-2/5 gap-4">
          <BookingSummaryCard booking={res.data} />
        </div>
      </div>
    </div>
  )
}
