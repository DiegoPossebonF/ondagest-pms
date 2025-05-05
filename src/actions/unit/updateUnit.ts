import type { UnitFormValues } from '@/components/unit/UnitForm'

export async function updateUnit(values: UnitFormValues, unitId: string) {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required')
    }

    if (!values.type || values.type === '') {
      throw new Error('Unit type is required')
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/units/${unitId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: values.name,
          typeId: values.type,
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
