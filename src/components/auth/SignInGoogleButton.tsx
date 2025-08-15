'use client'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { Button } from '../ui/button'

export default function SignInGoogleButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  return (
    <Button
      type="button"
      className="w-full"
      variant={'outline'}
      size={'sm'}
      disabled={loading}
      onClick={handleGoogleSignIn}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          <IconBrandGoogleFilled /> Entrar com Google
        </>
      )}
    </Button>
  )
}
