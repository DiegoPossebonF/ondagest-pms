import type { DateRange } from 'react-day-picker'

export async function getUnitsByPeriod(period: DateRange, bookingId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/units/search/${JSON.stringify(period)}/${bookingId}`,
      {
        method: 'GET',
      }
    )

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
