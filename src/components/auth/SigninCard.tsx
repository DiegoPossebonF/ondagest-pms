import Logo from '@/public/images/LogoOndaGestName.png'
import ImagemLogin from '@/public/images/wallpapper-login.webp'
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

export function SigninCard({ children }: SigninCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Lado Esquerdo - Formulário */}
        <div className="flex flex-col justify-center p-4">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src={Logo.src} alt="Logo" className="h-40 w-auto" />
            </div>

            <CardTitle className="text-4xl text-gray-700 text-center">
              Seja Bem-vindo!
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Entre com seu e-mail e senha para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>{children}</CardContent>
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
