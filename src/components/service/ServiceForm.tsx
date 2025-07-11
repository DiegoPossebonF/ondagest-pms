'use client'
import { createService } from '@/app/actions/service/createService'
import { updateService } from '@/app/actions/service/updateService'
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
import { formatCurrency } from '@/lib/utils'
import { type ServiceSchema, serviceSchema } from '@/schemas/service-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoadingSpinner } from '../LoadingSpinner'
import { ServiceAlertDialogDelete } from './ServiceAlertDialogDelete'

interface ServiceFormProps {
  bookingId: number
  service?: Service
  closeDialog?: () => void
}

export function ServiceForm({
  bookingId,
  service,
  closeDialog,
}: ServiceFormProps) {
  const [openPopover, setOpenPopover] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      bookingId: bookingId.toString(),
      name: service?.name || '',
      amount: service?.amount || 0,
    },
  })

  async function onSubmitHandle(values: ServiceSchema) {
    if (service) {
      startTransition(() => {
        updateService(service.id, values).then(data => {
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
        createService(values).then(data => {
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
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Serviço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Informe o serviço"
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
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? (
                service ? (
                  <LoadingSpinner />
                ) : (
                  <LoadingSpinner />
                )
              ) : service ? (
                'Salvar alterações'
              ) : (
                'Lançar Desconto'
              )}
            </Button>
            {service && (
              <ServiceAlertDialogDelete
                service={service}
                setOpen={setOpenPopover}
                open={openPopover}
                closeSheet={closeDialog}
              >
                <Button className="bg-red-500 hover:bg-red-400" size={'sm'}>
                  Excluir
                </Button>
              </ServiceAlertDialogDelete>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
