'use client'
import type { Discount } from '@/app/generated/prisma'
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
import { formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const DiscountSchema = z.object({
  bookingId: z.number().min(1, { message: 'Reserva não informada!' }),
  reason: z.string().min(1, { message: 'Informe a razão do desconto' }),
  amount: z.string().min(1, 'Valor é obrigatório'),
})

export type DiscountFormValues = z.infer<typeof DiscountSchema>

interface DiscountFormProps {
  booking: BookingAllIncludes
  discount?: Discount
}

export function DiscountForm({ booking, discount }: DiscountFormProps) {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(DiscountSchema),
    defaultValues: {
      bookingId: discount?.bookingId || 1,
      reason: discount?.reason || '',
      amount: discount ? formatCurrency(discount.amount) : '',
    },
  })

  useEffect(() => {
    form.reset({
      bookingId: discount?.bookingId || 1,
      reason: discount?.reason || '',
      amount: discount ? formatCurrency(discount.amount) : '',
    })
  }, [discount, form])

  async function onSubmitHandle(values: DiscountFormValues) {
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
            name="reason"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Razão</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    placeholder="Informe a razão do desconto"
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
                      const formatted = formatCurrency(numberValue)
                      field.onChange(formatted)
                    }}
                    value={field.value}
                    placeholder="Valor do desconto"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
              ? discount
                ? 'Salvando...'
                : 'Lançando...'
              : discount
                ? 'Salvar alterações'
                : 'Lançar desconto'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
