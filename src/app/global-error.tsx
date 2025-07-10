'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { IconExclamationCircle } from '@tabler/icons-react'
import { motion } from 'framer-motion'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Alert className="text-center">
          <IconExclamationCircle className="mx-auto h-12 w-12 text-destructive" />
          <AlertTitle className="mt-4 text-2xl font-bold">
            Ocorreu um erro
          </AlertTitle>
          <AlertDescription className="mt-2 mb-4 text-muted-foreground">
            Não foi possível carregar esta página. Tente novamente ou entre em
            contato com o suporte se o problema persistir.
          </AlertDescription>
          <Button onClick={() => reset()} variant="secondary" size={'sm'}>
            Tentar novamente
          </Button>
        </Alert>
      </motion.div>
    </div>
  )
}
