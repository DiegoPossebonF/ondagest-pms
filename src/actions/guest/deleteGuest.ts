export async function deleteGuest(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guest/${id}`,
      {
        method: 'DELETE',
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
