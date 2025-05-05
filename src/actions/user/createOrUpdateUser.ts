'use server'
import type { UserFormValues } from '@/components/user/UserForm'
import { revalidatePath } from 'next/cache'
import type { User } from '../../../prisma/generated/client'

export async function createOrUpdateUser(values: UserFormValues, user?: User) {
  try {
    if (!user) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          avatar: values.avatar,
          role: values.role,
        }),
      })

      const data = await res.json()

      if (!data.error) {
        revalidatePath('/users')
        return data
      }

      throw new Error(data.error)
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'PUT',
      body: JSON.stringify({
        id: user.id,
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar,
        role: values.role,
      }),
    })

    const data = await res.json()

    if (!data.error) {
      revalidatePath('/users')
      return data
    }

    throw new Error(data.error)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}
