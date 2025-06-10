'use client'
import { createPayment } from '@/app/actions/payment/createPayment'
import { updatePayment } from '@/app/actions/payment/updatePayment'
import type { Payment } from '@/app/generated/prisma'
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
import { updateBookingPaymentStatus } from '@/lib/actions/updateBookingPaymentStatus'
import { cn, formatCurrency, parseCurrencyToNumber } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const PaymentSchema = z.object({
  bookingId: z.string().min(1, 'ID da reserva é obrigatório'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  paymentType: z.enum([
    '',
    'CASH',
    'PIX',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'OTHER',
  ]),
  paidAt: z.coerce.date(),
  paymentId: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof PaymentSchema>

interface PaymentFormProps {
  booking: BookingAllIncludes
  payment?: Payment
  openDialog?: Dispatch<SetStateAction<boolean>>
}

export function PaymentForm({
  booking,
  payment,
  openDialog,
}: PaymentFormProps) {
  const [openPopover, setOpenPopover] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      bookingId: booking.id.toString(),
      amount: payment ? formatCurrency(payment?.amount) : '',
      paymentId: payment?.id,
      paymentType: payment ? payment.paymentType : '',
      paidAt: payment?.paidAt,
    },
  })

  // 🔁 Atualiza o valor quando a edição muda (ex: abrir o dialog com outro pagamento)
  useEffect(() => {
    form.reset({
      bookingId: booking.id.toString(),
      amount: payment ? formatCurrency(payment?.amount) : '',
      paymentId: payment?.id,
      paymentType: payment ? payment.paymentType : 'CASH',
      paidAt: payment?.paidAt,
    })
  }, [booking.id, payment, form])

  async function onSubmitHandle(values: PaymentFormValues) {
    setLoading(true)

    try {
      const action = payment
        ? await updatePayment({
            id: payment.id,
            bookingId: booking.id,
            amount: parseCurrencyToNumber(values.amount),
            paidAt: values.paidAt,
            paymentType: values.paymentType as Payment['paymentType'],
          })
        : await createPayment({
            bookingId: booking.id,
            amount: parseCurrencyToNumber(values.amount),
            paidAt: values.paidAt,
            paymentType: values.paymentType as Payment['paymentType'],
          })

      if (action.success) {
        toast('Sucesso', {
          description: payment
            ? 'Pagamento atualizado com sucesso'
            : 'Pagamento lançado com sucesso',
        })
        await updateBookingPaymentStatus(booking.id)
        router.refresh()
        openDialog?.(false)
      } else {
        toast('Erro', {
          description: action.msg,
        })
      }
    } catch (err) {
      toast('Erro', {
        description:
          err instanceof Error
            ? err.message
            : 'Erro interno - fale com o desenvolvedor',
      })
    } finally {
      setLoading(false)
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
            name="paymentType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CREDIT_CARD">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                    <SelectItem value="CASH">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      Transferência Bancária
                    </SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Pagamento</FormLabel>
                <Popover
                  open={openPopover}
                  onOpenChange={setOpenPopover}
                  modal={openPopover}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'default'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format('DD/MM/YYYY')
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    forceMount
                    className="w-auto p-0 z-[9999]"
                    align="center"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={date => {
                        setOpenPopover(false)
                        field.onChange(date)
                      }}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading
              ? payment
                ? 'Salvando...'
                : 'Lançando...'
              : payment
                ? 'Salvar alterações'
                : 'Lançar pagamento'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
