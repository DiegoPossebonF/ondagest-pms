import type { Metadata } from 'next'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export const metadata: Metadata = {
  title: 'PMS - Morada da Praia Centro',
  description: 'PMS - Morada da Praia Centro',
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
      </body>
    </html>
  )
}
