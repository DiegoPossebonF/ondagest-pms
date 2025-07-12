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
    <div className="md:h-[calc(100vh-4rem)] p-6 flex md:flex-row flex-col gap-6">
      <div className="md:basis-1/2">
        <BookingForm bookingData={res.data} />
      </div>
      <div className="md:basis-1/2">
        <BookingDetails booking={res.data} />
      </div>
    </div>
  )

  /*
  return (
    <div className="p-6 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="md:basis-1/2">
          <Card className="w-full">
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="flex flex-row items-center">
                Formulário da Reserva #{Number(id)}
              </CardTitle>
            </CardHeader>
            <Separator />

            <CardContent className="space-y-4">
              <BookingForm bookingData={res.data} />
            </CardContent>
            <CardFooter className="flex justify-end">TESTE</CardFooter>
          </Card>
        </div>
        <div className="md:basis-1/2">
          <BookingDetails booking={res.data} />
        </div>
      </div>
    </div>
  )
    */
}
