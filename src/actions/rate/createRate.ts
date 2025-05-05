import type { RateFormValues } from '@/components/rate/RateForm'

export async function createRate(values: RateFormValues) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates`, {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        numberOfPeople: values.numberOfPeople,
        value: values.value,
        typeId: values.unitType,
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
