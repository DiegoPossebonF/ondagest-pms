export async function deleteUser(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
      {
        method: 'DELETE',
      }
    )

    const data = await response.json()

    if (!data.error) {
      return data
    }

    throw new Error(data.error)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}
