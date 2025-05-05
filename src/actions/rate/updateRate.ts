import type { RateFormValues } from '@/components/rate/RateForm'

export async function updateRate(values: RateFormValues, rateId: string) {
  try {
    if (!rateId) {
      throw new Error('ID da tarifa é requerido!')
    }

    if (!values.unitType || values.unitType === '') {
      throw new Error('ID tipo de acomodação é requerido!')
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rates/${rateId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: values.name,
          numberOfPeople: values.numberOfPeople,
          value: values.value,
          typeId: values.unitType,
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
