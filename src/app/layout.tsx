import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
  title: 'Ondagest - PMS',
  description:
    'OndaGest PMS é uma aplicação de gestão de hospedagens desenvolvida para facilitar o controle de reservas, pagamentos, serviços e descontos. Ideal para pequenas pousadas e casas de temporada, a plataforma oferece uma interface moderna, clara e eficiente para o gestor acompanhar toda a jornada do hóspede.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-center" closeButton={true} />
        <SpeedInsights />
      </body>
    </html>
  )
}
