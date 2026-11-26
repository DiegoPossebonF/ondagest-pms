import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { IconExclamationCircle } from '@tabler/icons-react'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <Alert className="text-center">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <IconExclamationCircle className="h-12 w-12 text-destructive" />
            <AlertTitle className="text-2xl font-bold">
              Acesso negado
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Não foi possível entrar com essa conta. Se você já possui uma
              conta, entre com e-mail e senha. Caso contrário, crie uma nova
              conta.
            </AlertDescription>
            <Button variant={'secondary'} size={'sm'} asChild>
              <Link href="/signin">Voltar para o login</Link>
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  )
}
