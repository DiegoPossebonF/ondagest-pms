import Logo from '@/public/images/LogoOndaGestName.png'
import ImagemLogin from '@/public/images/wallpapper-login.webp'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface SignupCardProps {
  children: React.ReactNode
}

export function SignupCard({ children }: SignupCardProps) {
  return (
    <Card className="overflow-hidden max-w-4xl m-4 shadow-xl border-2 border-blue-500">
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Lado Esquerdo - Formulário */}
        <div className="flex flex-col justify-center p-4">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src={Logo.src} alt="Logo" className="h-32 w-auto" />
            </div>

            <CardTitle className="text-2xl text-gray-700 text-center">
              Crie sua conta no OndaGest
            </CardTitle>
            <CardDescription className="text-base text-center">
              Organize sua hospedagem em um só lugar. Cadastre-se e comece a
              usar agora mesmo.
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
