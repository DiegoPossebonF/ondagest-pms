import type { BookingFormValues } from '@/components/booking/BookingForm'

export async function updateBooking(
  values: BookingFormValues,
  bookingId: number
) {
  try {
    if (!bookingId) {
      throw new Error('ID do Hospede é requerido!')
    }

    console.log('data do update WWQEWE')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}`,
      {
        method: 'PUT',
        body: JSON.stringify(values),
      }
    )

    const data = await res.json()

    console.log('data do update', data)

    if (!data.error) {
      return data
    }

    throw new Error(data.error)
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message }
    }
  }
}
