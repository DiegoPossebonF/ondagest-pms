import type { GuestFormValues } from '@/components/guest/GuestForm'

export async function createGuest(values: GuestFormValues) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guest`, {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
      }),
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
