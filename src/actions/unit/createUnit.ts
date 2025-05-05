import type { UnitFormValues } from '@/components/unit/UnitForm'

export async function createUnit(values: UnitFormValues) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        typeId: values.type,
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
