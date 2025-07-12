import BookingForm from '@/components/booking/BookingForm'

export default async function NewBookingPage() {
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="w-full md:w-1/2">
        <BookingForm />
      </div>
    </div>
  )
}
