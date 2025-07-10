'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { IconExclamationCircle } from '@tabler/icons-react'
import { motion } from 'framer-motion'

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
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
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            <IconExclamationCircle className="h-12 w-12 text-destructive" />
            <AlertTitle className="text-2xl font-bold">
              Algo deu errado
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {error.message}
            </AlertDescription>
            <Button variant={'secondary'} size={'sm'} onClick={() => reset()}>
              Recarregar
            </Button>
          </div>
        </Alert>
      </motion.div>
    </div>
  )
}
