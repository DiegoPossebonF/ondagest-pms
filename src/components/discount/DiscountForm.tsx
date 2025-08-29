'use client'
import { createDiscount } from '@/app/actions/discount/createDiscount'
import { updateDiscount } from '@/app/actions/discount/updateDiscount'
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
import { type DiscountSchema, discountSchema } from '@/schemas/discount-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Discount } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { type TransitionStartFunction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DiscountAlertDialogDelete } from './DiscountAlertDialogDelete'

interface DiscountFormProps {
  bookingId: number
  discount?: Discount
  closeDialog?: () => void
  startTransition: TransitionStartFunction
  isPending: boolean
}

export function DiscountForm({
  bookingId,
  discount,
  closeDialog,
  startTransition,
  isPending,
}: DiscountFormProps) {
  const [openPopover, setOpenPopover] = useState(false)
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<DiscountSchema>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      bookingId: bookingId.toString(),
      reason: discount?.reason || '',
      amount: discount?.amount || 0,
    },
  })

  async function onSubmitHandle(values: DiscountSchema) {
    if (discount) {
      startTransition(() => {
        updateDiscount(discount.id, values).then(data => {
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
        //alert(JSON.stringify(values))
        createDiscount(values).then(data => {
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
            name="reason"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Motivo do desconto</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Informe o motivo"
                    className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
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
              {isPending
                ? discount
                  ? 'Salvando...'
                  : 'Lançando...'
                : discount
                  ? 'Salvar alterações'
                  : 'Lançar Desconto'}
            </Button>
            {discount && (
              <DiscountAlertDialogDelete
                discount={discount}
                setOpen={setOpenPopover}
                open={openPopover}
                closeSheet={closeDialog}
              >
                <Button className="bg-red-500 hover:bg-red-400" size={'sm'}>
                  Excluir
                </Button>
              </DiscountAlertDialogDelete>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
