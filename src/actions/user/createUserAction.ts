import type { UserFormValues } from '@/components/user/UserForm'

export async function createUser(values: UserFormValues) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar ? values.avatar : undefined,
        role: values.role,
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
