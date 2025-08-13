'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '../../../public/images/LogoOndaGestName.png'
import ImagemLogin from '../../../public/images/wallpapper-login.webp'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { SignupForm } from './SignupForm'

const SuccessMessage = () => {
  const router = useRouter()
  return (
    <>
      <CardTitle className="text-2xl text-gray-700 text-center">
        Conta criada com sucesso
      </CardTitle>
      <CardDescription className="text-base text-center">
        Enviamos um e-mail de confirmação para o seu e-mail de cadastro.
        Verifique sua caixa de entrada e efetue a confirmação.
      </CardDescription>
      <Button
        className="w-full"
        size={'sm'}
        variant={'secondary'}
        onClick={() => {
          router.push('/signin')
        }}
      >
        Ir para o login
      </Button>
    </>
  )
}

export function SignupCard() {
  const [success, setSuccess] = useState(false)

  return (
    <Card className="overflow-hidden max-w-4xl m-4 shadow-xl border-2 border-blue-500">
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Lado Esquerdo - Formulário */}
        <div className="flex flex-col justify-center p-4">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src={Logo.src} alt="Logo" className="h-28 w-auto" />
            </div>

            {success ? (
              <SuccessMessage />
            ) : (
              <>
                <CardTitle className="text-2xl text-gray-700 text-center">
                  Crie sua conta no OndaGest
                </CardTitle>
                <CardDescription className="text-base text-center">
                  Organize sua hospedagem em um só lugar. Cadastre-se e comece a
                  usar agora mesmo.
                </CardDescription>
              </>
            )}
          </CardHeader>
          {!success && (
            <CardContent>
              <SignupForm setSuccess={() => setSuccess(true)} />
            </CardContent>
          )}
        </div>

        {/* Lado Direito - Imagem */}
        <div className="hidden md:block relative">
          <img
            src={ImagemLogin.src}
            alt="Imagem de Login"
            className="absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  )
}
