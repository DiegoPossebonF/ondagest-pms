'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconAlertSquareRounded } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingSpinner } from '../LoadingSpinner'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'

const ForgotPassword = z.object({
  email: z.string().email('E-mail inválido'),
})

type ForgotPasswordData = z.infer<typeof ForgotPassword>

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPassword),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordData) => {
    startTransition(async () => {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      })
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="space-y-2">
        <Card>
          <CardHeader className="flex flex-row p-2 space-y-0">
            <div className="min-w-10 flex flex-row items-center justify-center ">
              <IconAlertSquareRounded className="text-green-500" />
            </div>
            <CardTitle className="flex flex-row text-sm text-muted-foreground  items-center justify-center">
              Se o email estiver cadastrado, enviamos um link de recuperação.
              Verifique sua caixa de entrada.
            </CardTitle>
            <CardDescription className="sr-only">
              Se o email estiver cadastrado, enviamos um link de recuperação.
              Verifique sua caixa de entrada.
            </CardDescription>
          </CardHeader>
        </Card>
        <Button
          type="button"
          className="w-full"
          variant={'secondary'}
          size={'sm'}
          disabled={isPending}
          onClick={() => router.push('/signin')}
        >
          {isPending ? <LoadingSpinner size="sm" /> : 'Voltar'}
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Campo de E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label htmlFor="email">E-mail</Label>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          variant={'default'}
          size={'sm'}
          disabled={isPending}
        >
          {isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Enviar e-mail de redefinição de senha'
          )}
        </Button>
        <Button
          type="button"
          className="w-full"
          variant={'secondary'}
          size={'sm'}
          disabled={isPending}
          onClick={() => router.push('/signin')}
        >
          {isPending ? <LoadingSpinner size="sm" /> : 'Voltar'}
        </Button>
      </form>
    </Form>
  )
}
