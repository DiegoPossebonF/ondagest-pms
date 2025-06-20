import BookingForm from '@/components/booking/BookingForm'

export default async function NewBookingPage() {
  return (
    <div className="flex flex-col justify-center items-center p-6 md:w-2/3 lg:w-1/2">
      <BookingForm />
    </div>
  )
}
