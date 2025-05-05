import type { UnitTypeFormValues } from '@/components/unit-type/UnitTypeForm'

export async function createUnitType(values: UnitTypeFormValues) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unit-types`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          numberOfPeople: values.numberOfPeople,
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
