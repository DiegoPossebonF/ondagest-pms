import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { FieldErrors } from 'react-hook-form'

interface FormErrorProps {
  serverError?: string
  errors: FieldErrors
}

export function BookingFormError({ errors, serverError }: FormErrorProps) {
  const hasErrors = Object.keys(errors).length > 0

  if (!hasErrors && !serverError) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {hasErrors
          ? 'Formulário para nova reserva incompleto!'
          : 'Ocorreu um erro'}
      </AlertTitle>
      <AlertDescription>
        {hasErrors && (
          <ul className="space-y-1">
            {Object.values(errors).map(
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              (error: any, index) =>
                error?.message && (
                  <li key={`form-error-${index}`}>- {error.message}</li>
                )
            )}
          </ul>
        )}

        {serverError && <ul className="space-y-1">{serverError}</ul>}
      </AlertDescription>
    </Alert>
  )
}
