'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPasswordUser } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { FormError } from '../FormError'
import { LoadingSpinner } from '../LoadingSpinner'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

const resetPassword = z.object({
  password: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter ao menos um número')
    .regex(/[\W_]/, 'Deve conter ao menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatório'),
})

type ResetPasswordData = z.infer<typeof resetPassword>

export function ResetPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: ResetPasswordData) {
    startTransition(async () => {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setServerError(data.error || 'Erro ao redefinir senha')
      }
    })
  }

  if (success) {
    return (
      <div className="space-y-2">
        <Card>
          <CardHeader className="flex flex-row p-2 space-y-0">
            <div className="min-w-10 flex flex-row items-center justify-center ">
              <IconPasswordUser className="text-green-500" />
            </div>
            <CardTitle className="flex flex-row text-sm text-muted-foreground  items-center justify-center">
              Senha alterada com sucesso! Você já pode fazer login.
            </CardTitle>
            <CardDescription className="sr-only">
              Senha alterada com sucesso! Você já pode fazer login.
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
      <FormError errors={form.formState.errors} serverError={serverError} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-muted-foreground">Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-muted-foreground">
                Confirmar Senha
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          size={'sm'}
        >
          {isPending ? <LoadingSpinner size="sm" /> : 'Alterar Senha'}
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
