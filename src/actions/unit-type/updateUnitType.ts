import type { UnitTypeFormValues } from '@/components/unit-type/UnitTypeForm'

export async function updateUnitType(
  values: UnitTypeFormValues,
  unitTypeId: string
) {
  try {
    if (!unitTypeId) {
      throw new Error('Tipo de acomodação não encontrado!')
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unit-types/${unitTypeId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          id: unitTypeId,
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
