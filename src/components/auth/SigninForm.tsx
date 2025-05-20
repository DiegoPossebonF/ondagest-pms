'use client'
import { signinAction } from '@/app/(public)/(auth)/actions'
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
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from '../ui/label'

const SigninSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type SigninFormData = z.infer<typeof SigninSchema>

export function SigninForm() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SigninFormData) => {
    const { success, error } = await signinAction(values.email, values.password)

    if (success) {
      router.push('/')
    }

    setErrorMessage(error || '')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
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
        {/* Campo de Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeIn' }}
            className="flex flex-row items-center text-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
        {/* Botão de Login */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
        <Button
          type="button"
          className="w-full"
          variant={'ghost'}
          onClick={() => router.push('/signup')}
        >
          Criar Conta
        </Button>
      </form>
    </Form>
  )
}
