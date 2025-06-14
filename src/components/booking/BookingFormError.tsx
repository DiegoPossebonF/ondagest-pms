import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { FieldErrors } from 'react-hook-form'

interface FormErrorProps {
  errors: FieldErrors
}

export function BookingFormError({ errors }: FormErrorProps) {
  const hasErrors = Object.keys(errors).length > 0

  if (!hasErrors) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Formulário para nova reserva incompleto!</AlertTitle>
      <AlertDescription>
        <ul className="space-y-1">
          {Object.values(errors).map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (error: any, index) =>
              error?.message && <li key={index}>- {error.message}</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
