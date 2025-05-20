'use client'
import { createDiscount } from '@/app/actions/discount/createDiscount'
import { updateDiscount } from '@/app/actions/discount/updateDiscount'
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
import { useToast } from '@/hooks/use-toast'
import { updateBookingPaymentStatus } from '@/lib/actions/updateBookingPaymentStatus'
import { formatCurrency, parseCurrencyToNumber } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
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
  openDialog?: Dispatch<SetStateAction<boolean>>
}

export function DiscountForm({
  booking,
  discount,
  openDialog,
}: DiscountFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(DiscountSchema),
    defaultValues: {
      bookingId: discount?.bookingId || booking.id,
      reason: discount?.reason || '',
      amount: discount ? formatCurrency(discount.amount) : '',
    },
  })

  useEffect(() => {
    form.reset({
      bookingId: discount?.bookingId || booking.id,
      reason: discount?.reason || '',
      amount: discount ? formatCurrency(discount.amount) : '',
    })
  }, [discount, booking, form])

  async function onSubmitHandle(values: DiscountFormValues) {
    try {
      const action = discount
        ? await updateDiscount({
            id: discount.id,
            ...values,
            amount: parseCurrencyToNumber(values.amount),
          })
        : await createDiscount({
            ...values,
            amount: parseCurrencyToNumber(values.amount),
          })

      if (action.success) {
        toast({
          variant: 'success',
          title: 'Sucesso',
          description: action.msg,
        })
        await updateBookingPaymentStatus(booking.id)
        router.refresh()
        openDialog?.(false)
      } else {
        toast({
          title: 'Erro',
          description: action.msg,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Erro',
        description:
          err instanceof Error
            ? err.message
            : 'Erro interno - fale com o desenvolvedor',
        variant: 'destructive',
      })
    }
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
