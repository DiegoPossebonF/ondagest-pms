import type { BookingFormValues } from '@/components/booking/BookingForm'

export async function createBooking(values: BookingFormValues) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking`, {
      method: 'POST',
      body: JSON.stringify(values),
    })

    const data = await res.json()
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
