'use client'
import { createPayment } from '@/app/actions/payment/createPayment'
import { updatePayment } from '@/app/actions/payment/updatePayment'
import ReceiptViewer from '@/components/pdf/ReceiptViewer'
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
import dayjs from '@/lib/dayjs'
import {
  PAYMENT_TYPE_ICONS,
  PAYMENT_TYPE_LABELS,
  cn,
  formatCurrency,
} from '@/lib/utils'
import { type PaymentSchema, paymentSchema } from '@/schemas/payment-schema'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Payment, PaymentType } from '@prisma/client'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { PaymentAlertDialogDelete } from './PaymentAlertDialogDelete'

interface PaymentFormProps {
  booking: BookingAllIncludes
  payment?: Payment
  closeDialog?: () => void
}

export function PaymentForm({
  booking,
  payment,
  closeDialog,
}: PaymentFormProps) {
  const [openPopover, setOpenPopover] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const form = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      bookingId: booking.id.toString(),
      amount: payment?.amount || 0,
      paymentType: payment?.paymentType || 'PIX',
      paidAt: payment?.paidAt || dayjs().toDate(),
    },
  })

  async function onSubmitHandle(values: PaymentSchema) {
    if (payment) {
      startTransition(() => {
        updatePayment(payment.id, values).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setServerError(null)
            form.reset()
            router.refresh()
            if (closeDialog) {
              closeDialog()
            }
          }
        })
      })
    } else {
      startTransition(() => {
        createPayment(values).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setServerError(null)
            form.reset()
            router.refresh()
            if (closeDialog) {
              closeDialog()
            }
          }
        })
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
            name="paymentType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={'h-8 rounded-md px-3 text-xs bg-popover'}
                    >
                      <SelectValue placeholder="Selecione a forma de pagamento..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PaymentType).map(status => {
                      const Icon = PAYMENT_TYPE_ICONS[status]
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {PAYMENT_TYPE_LABELS[status]}
                          </div>
                        </SelectItem>
                      )
                    })}
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
                        variant={'outline'}
                        size={'sm'}
                        className={cn(
                          'w-full pl-3 text-left font-normal bg-popover',
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
                      field.onChange(formatCurrency(numberValue))
                    }}
                    value={formatCurrency(field.value)}
                    placeholder="Informe o valor"
                    className={
                      'h-8 rounded-md px-3 text-xs md:text-xs bg-popover'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full mt-4"
              size={'sm'}
              disabled={isPending}
            >
              <IconDeviceFloppy className="w-4 h-4" />
              {isPending
                ? payment
                  ? 'Salvando...'
                  : 'Lançando...'
                : payment
                  ? 'Salvar alterações'
                  : 'Lançar pagamento'}
            </Button>
            {payment && (
              <>
                <ReceiptViewer booking={booking} payment={payment} />
                <PaymentAlertDialogDelete
                  payment={payment}
                  open={openDeleteDialog}
                  setOpen={setOpenDeleteDialog}
                  closeSheet={closeDialog}
                >
                  <Button className="bg-red-500 hover:bg-red-400" size={'sm'}>
                    Excluir
                  </Button>
                </PaymentAlertDialogDelete>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
