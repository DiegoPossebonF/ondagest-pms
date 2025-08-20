'use client'
import { IconMailCheck } from '@tabler/icons-react'
import { usePathname, useSearchParams } from 'next/navigation'
import Logo from '../../../public/images/LogoOndaGestName.png'
import ImagemLogin from '../../../public/images/wallpapper-login.webp'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface SigninCardProps {
  children: React.ReactNode
}

export default function SigninCard({ children }: SigninCardProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')

  return (
    <Card className="overflow-hidden max-w-4xl shadow-xl">
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Lado Esquerdo - Formulário */}
        <div className="flex flex-col justify-center p-4">
          <CardHeader className="space-y-0">
            <div className="flex justify-center">
              <img src={Logo.src} alt="Logo" className="h-32 w-auto" />
            </div>
            {pathname === '/signin' && (
              <>
                <CardTitle className="text-2xl text-gray-700 text-center">
                  Seja Bem-vindo!
                </CardTitle>
                <CardDescription className="text-base text-center">
                  Entre com seu e-mail e senha para acessar sua conta
                </CardDescription>
              </>
            )}
            {pathname === '/forgot-password' && (
              <>
                <CardTitle className="text-2xl text-gray-700 text-center">
                  Esqueceu sua senha?
                </CardTitle>
                <CardDescription className="text-base text-center">
                  Informe seu e-mail para redefinir sua senha
                </CardDescription>
              </>
            )}
            {pathname === '/reset-password' && (
              <>
                <CardTitle className="text-2xl text-gray-700 text-center">
                  Redefinir senha
                </CardTitle>
                <CardDescription className="text-base text-center">
                  Crie uma nova senha e confirme-a para redefinir sua senha
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {verified && pathname !== '/forgot-password' && (
              <Card>
                <CardHeader className="flex flex-row p-2 space-y-0">
                  <div className="min-w-10 flex flex-row items-center justify-center ">
                    <IconMailCheck className="text-green-500" />
                  </div>
                  <CardTitle className="flex flex-row text-sm text-muted-foreground  items-center justify-center">
                    Conta verificada com sucesso!
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Conta verificada com sucesso!
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {children}
          </CardContent>
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
