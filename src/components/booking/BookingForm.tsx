'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

import { groupedByRateNamePerUnit } from '@/app/(private)/(dashboard)/bookings/new/actions'
import { createBooking } from '@/app/actions/booking/createBooking'
import { BookingStatus, type Rate } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import type { BookingAllIncludes } from '@/types/booking'
import type { Dictionary } from 'lodash'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { GuestCombobox } from '../guest/GuestCombobox'
import { RatesCombobox } from '../rate/RatesCombobox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { UnitsCombobox } from '../unit/UnitsCombobox'
import { BookingDateRangeCalendar } from './BookingDateRangeCalendar'
import { BookingFormError } from './BookingFormError'
import { BookingStatusCombobox } from './BookingStatusCombobox'

interface BookingFormProps {
  booking?: BookingAllIncludes
}

export default function BookingForm({ booking }: BookingFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [rates, setRates] = useState<Dictionary<Rate[]> | null>(null)

  const form = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: booking?.status || BookingStatus.PENDING,
      guestId: booking?.guestId || '',
      period: {
        from: booking?.startDate || dayjs().toDate(),
        to: booking?.endDate || dayjs().add(1, 'day').toDate(),
      },
      unitId: booking?.unitId || '',
      numberOfPeople: booking?.numberOfPeople || 1,
      selectedRateName: '',
      daily: 0,
      totalAmount: booking?.totalAmount || 0,
    },
  })

  const watchUnit = form.watch('unitId')
  const watchSelectedRateName = form.watch('selectedRateName')
  const watchPeople = form.watch('numberOfPeople')
  const watchStartDate = form.watch('period.from')
  const watchEndDate = form.watch('period.to')
  const watchDaily = form.watch('daily')
  const watchTotalAmount = form.watch('totalAmount')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function getRates() {
      const dataRates = await groupedByRateNamePerUnit(form.watch('unitId'))
      setRates(dataRates)
    }
    getRates()
  }, [form.watch('unitId')])

  useEffect(() => {
    if (
      !rates ||
      !watchSelectedRateName ||
      !watchUnit ||
      !watchPeople ||
      !watchStartDate ||
      !watchEndDate
    ) {
      form.setValue('daily', 0)
      form.setValue('totalAmount', 0)
      return
    }

    const rateOptions = rates[watchSelectedRateName] || []

    const sorted = rateOptions.sort(
      (a, b) => a.numberOfPeople - b.numberOfPeople
    )

    // Busca tarifa >= pessoas
    const matched = sorted.find(rate => rate.numberOfPeople >= watchPeople)

    const finalRate = matched || sorted[sorted.length - 1] // usa maior disponível se não encontrou

    form.setValue(
      'totalAmount',
      finalRate?.value
        ? finalRate.value * dayjs(watchEndDate).diff(watchStartDate, 'day')
        : 0,
      {
        shouldValidate: true,
      }
    )
    form.setValue('daily', finalRate?.value ? finalRate.value : 0, {
      shouldValidate: true,
    })
  }, [
    watchUnit,
    watchSelectedRateName,
    watchPeople,
    watchStartDate,
    watchEndDate,
    rates,
    form.setValue,
  ])

  useEffect(() => {
    if (!watchTotalAmount) {
      form.setValue('daily', 0)
      return
    }

    form.setValue(
      'daily',
      watchTotalAmount / dayjs(watchEndDate).diff(watchStartDate, 'day'),
      {
        shouldValidate: true,
      }
    )
  }, [watchEndDate, watchStartDate, watchTotalAmount, form.setValue])

  useEffect(() => {
    if (watchDaily) {
      form.setValue(
        'totalAmount',
        watchDaily * dayjs(watchEndDate).diff(watchStartDate, 'day'),
        {
          shouldValidate: true,
        }
      )
    }
  }, [watchDaily, watchEndDate, watchStartDate, form.setValue])

  const [isPending, startTransition] = useTransition()

  async function onSubmit(values: BookingSchema) {
    startTransition(() => {
      createBooking(values).then(data => {
        if (data.error) {
          setServerError(data.error)
          return
        }
        if (data.success) {
          toast('Sucesso', {
            description: data.success,
          })
          form.reset()
          setServerError(null)
          router.push('/bookings')
        }
      })
    })
  }

  return (
    <Card className="w-full xl:w-1/2 lg:w-2/3 md:w-3/4 sm:w-3/4">
      <CardHeader>
        <CardTitle>Nova Reserva</CardTitle>
        <CardDescription className="sr-only">
          Preencha o formulário abaixo para criar uma nova reserva
        </CardDescription>
      </CardHeader>

      <CardContent>
        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}
        <BookingFormError errors={form.formState.errors} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status da reserva</FormLabel>
                  <BookingStatusCombobox
                    value={field.value}
                    setValue={form.setValue}
                  />
                  <FormDescription className="sr-only">
                    Selecione o status da reserva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hóspede</FormLabel>
                  <GuestCombobox
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormDescription className="sr-only">
                    Selecione o hóspede da reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Período</FormLabel>
                  <BookingDateRangeCalendar
                    value={field.value}
                    setValue={form.setValue}
                  />
                  <FormDescription>
                    Quantidade de dias:
                    {field.value.from && field.value.to
                      ? ` ${dayjs(field.value.to).diff(
                          field.value.from,
                          'day'
                        )}`
                      : 0}
                  </FormDescription>
                  <FormDescription className="sr-only">
                    Selecione o período da reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Acomodação</FormLabel>
                  <UnitsCombobox
                    value={field.value}
                    onChange={field.onChange}
                    period={form.watch('period')}
                  />
                  <FormDescription className="sr-only">
                    Selecione a acomodação da reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedRateName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tarifa</FormLabel>

                  <RatesCombobox
                    rates={rates}
                    selectedRateName={field.value}
                    onChange={field.onChange}
                    disabled={!form.watch('unitId')}
                  />

                  <FormDescription className="sr-only">
                    Selecione uma tarifa para a reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nº de Pessoas</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={field.value}
                    onChange={e => {
                      const val = e.target.value
                      if (val === '') {
                        field.onChange('')
                        return
                      }

                      const num = Number(val)
                      if (!Number.isNaN(num) && num >= 1) {
                        field.onChange(num)
                      }
                    }}
                    className={'h-8 rounded-md px-3 text-xs bg-popover'}
                  />
                  <FormDescription className="sr-only">
                    Informe quantidade de pessoas
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daily"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Diária</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={field.value}
                    onChange={e => {
                      const val = e.target.value
                      if (val === '') {
                        field.onChange('')
                        return
                      }

                      const num = Number(val)
                      if (!Number.isNaN(num) && num >= 1) {
                        field.onChange(num)
                      }
                    }}
                    className={'h-8 rounded-md px-3 text-xs bg-popover'}
                    disabled={!form.watch('selectedRateName')}
                  />
                  <FormDescription className="sr-only">
                    Valor da diária da reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Total da reserva</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={event => {
                      form.setValue('totalAmount', Number(event.target.value))
                    }}
                    className={'h-8 rounded-md px-3 text-xs bg-popover'}
                    disabled
                  />
                  <FormDescription className="sr-only">
                    Valor total da reserva
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isPending ? 'Criando reserva...' : 'Criar reserva'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
