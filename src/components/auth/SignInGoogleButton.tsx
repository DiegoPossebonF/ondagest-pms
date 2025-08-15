'use client'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'

export default function SignInGoogleButton() {
  return (
    <Button
      type="button"
      className="w-full"
      variant={'outline'}
      size={'sm'}
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      <IconBrandGoogleFilled /> Entrar com Google
    </Button>
  )
}
