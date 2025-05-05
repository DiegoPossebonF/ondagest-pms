'use client'
import type { Service } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ServiceSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  amount: z
    .string()
    .min(1, { message: 'O valor é obrigatório' })
    .transform(value => Number(value)),
})

export type ServiceFormValues = z.infer<typeof ServiceSchema>

interface ServiceFormProps {
  booking: BookingAllIncludes
  service?: Service
}

export function ServiceForm({ booking, service }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: service?.name || '',
      amount: service?.amount || 0,
    },
  })

  useEffect(() => {
    form.reset({
      name: service?.name || '',
      amount: service?.amount || 0,
    })
  }, [service, form])

  async function onSubmitHandle(values: ServiceFormValues) {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandle)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Serviço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    placeholder="Informe o serviço"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de valor */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={e => {
                      const rawValue = e.target.value
                      const onlyDigits = rawValue.replace(/\D/g, '')
                      const numberValue = Number(onlyDigits) / 100
                      const formatted = numberValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                      field.onChange(formatted)
                    }}
                    value={field.value}
                    placeholder="Informe o valor"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? service
                ? 'Salvando...'
                : 'Lançando...'
              : service
                ? 'Salvar alterações'
                : 'Lançar serviço'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
