import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold">Página não encontrada</h2>
      <p className="text-muted-foreground">
        A página acessada não existe ou foi removida.
      </p>
      <Link href={'/'} className="text-blue-500 hover:underline">
        <Button variant="destructive" size={'sm'}>
          Voltar
        </Button>
      </Link>
    </div>
  )
}
