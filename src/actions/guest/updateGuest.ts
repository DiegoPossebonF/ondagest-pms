import type { GuestFormValues } from '@/components/guest/GuestForm'

export async function updateGuest(values: GuestFormValues, guestId: string) {
  try {
    if (!guestId) {
      throw new Error('ID do Hospede é requerido!')
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guest/${guestId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
        }),
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
