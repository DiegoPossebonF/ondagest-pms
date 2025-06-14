'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs, { type Dayjs } from 'dayjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { groupedByRateNamePerUnit } from '@/app/(private)/(dashboard)/bookings/new/actions'
import { BookingStatus, type Rate } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import type { Dictionary } from 'lodash'
import { useEffect, useState } from 'react'
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

const dayjsSchema: z.ZodType<Dayjs> = z.custom<Dayjs>(
  val => dayjs.isDayjs(val) && val.isValid(),
  {
    message: 'Data inválida',
  }
)

const dateRangeSchema = z
  .object({
    startDate: dayjsSchema,
    endDate: dayjsSchema,
  })
  .refine(val => val.startDate.isBefore(val.endDate), {
    message: 'A data de check-out deve ser maior que a data de check-in',
    path: ['startDate'],
  })

/**

  guestId        String
  unitId         String
  startDate      DateTime
  endDate        DateTime
  status         BookingStatus
  numberOfPeople Int
  totalAmount    Float
 
*/

const bookingSchema = z.object({
  status: z.enum(Object.values(BookingStatus) as [string, ...string[]]),
  guestId: z.string().min(1, 'Hóspede obrigatório'),
  dateRangeSchema: dateRangeSchema,
  unitId: z.string().min(1, 'Unidade obrigatória'),
  numberOfPeople: z.coerce.number().min(1, 'Mínimo de 1 pessoa'),
  selectedRateName: z.string().min(1, 'Tarifa obrigatória'),
  daily: z.coerce.number().min(1, 'Valor da diária obrigatório'),
  totalAmount: z.number().min(0, 'Valor inválido'),
})

export type NewBookingFormValues = z.infer<typeof bookingSchema>

export default function NewBookingForm() {
  const router = useRouter()
  const [rates, setRates] = useState<Dictionary<Rate[]> | null>(null)
  //const [selectedRateName, setSelectedRateName] = useState<string | null>(null)

  const form = useForm<NewBookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: BookingStatus.PENDING,
      guestId: '',
      dateRangeSchema: {
        startDate: dayjs(),
        endDate: dayjs().add(5, 'day'),
      },
      unitId: '',
      numberOfPeople: 1,
      selectedRateName: '',
      daily: 0,
      totalAmount: 0,
    },
  })

  const watchUnit = form.watch('unitId')
  const watchSelectedRateName = form.watch('selectedRateName')
  const watchPeople = form.watch('numberOfPeople')
  const watchStartDate = form.watch('dateRangeSchema.startDate')
  const watchEndDate = form.watch('dateRangeSchema.endDate')
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

  const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
    try {
      // Substitua com mutation real via server action ou api route
      //console.log('Creating booking', values)
      toast.success('Sucesso', {
        description: `${JSON.stringify(values, null, 2)} \n nameRate: ${watchSelectedRateName}`,
      })
      //router.push('/bookings')
    } catch (error) {
      toast.error('Erro ao criar reserva')
    }
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
              name="dateRangeSchema"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Período</FormLabel>
                  <BookingDateRangeCalendar
                    value={field.value}
                    setValue={form.setValue}
                  />
                  <FormDescription>
                    Quantidade de dias:
                    {field.value?.startDate && field.value?.endDate
                      ? ` ${dayjs(field.value.endDate).diff(
                          field.value.startDate,
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
                    period={form.watch('dateRangeSchema')}
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
              Reservar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
