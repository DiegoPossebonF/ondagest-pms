import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { FieldErrors } from 'react-hook-form'

interface FormErrorProps {
  serverError?: string | null
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
        {hasErrors ? 'Formulário incompleto!' : 'Ocorreu um erro'}
      </AlertTitle>
      <AlertDescription>
        {hasErrors && (
          <ul className="space-y-1">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {Object.values(errors).map((error: any, index) => {
              return error?.message ? (
                <li key={`form-error-${index}`}>- {error.message}</li>
              ) : error?.to ? (
                <li key={`form-error-${index}`}>- {error.to.message}</li>
              ) : null
            })}
          </ul>
        )}

        {serverError && (
          <ul className="space-y-1">
            <li>- {serverError}</li>
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
