'use client'

import { createBooking } from '@/app/actions/booking/createBooking'
import { updateBooking } from '@/app/actions/booking/updateBooking'
import { groupedByRateNamePerUnit } from '@/app/actions/rate/actions'
import { getUnitById } from '@/app/actions/unit/actions'
import { Button } from '@/components/ui/button'
import { padNumber } from '@/lib/utils'
import { type BookingSchema, bookingSchema } from '@/schemas/booking-schema'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Rate, Unit, UnitType } from '@prisma/client'

import dayjs from '@/lib/dayjs'
import type { Dictionary } from 'lodash'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import AlertErrorGlobal from '../AlertErrorGlobal'
import { LoadingSpinner } from '../LoadingSpinner'
import { GuestCombobox } from '../guest/GuestCombobox'
import { RatesCombobox } from '../rate/RatesCombobox'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { UnitsCombobox } from '../unit/UnitsCombobox'
import { BookingCancelAlertDialog } from './BookingCancelAlertDialog'
import { BookingDateRangeCalendar } from './BookingDateRangeCalendar'
import { BookingFormError } from './BookingFormError'
import { BookingStatusCombobox } from './BookingStatusCombobox'
import { useBookingFilters } from './BookingsFiltersProvider'

interface BookingFormProps {
  bookingData?: BookingAllIncludes
}

interface UnitWithType extends Unit {
  type: UnitType
}

export default function BookingForm({ bookingData }: BookingFormProps) {
  const [booking, setBooking] = useState<BookingAllIncludes | null>(
    bookingData || null
  )
  const { refetch } = useBookingFilters()
  const searchParams = useSearchParams()
  const unitIdParam = searchParams.get('unitId')
  const startDateParam = searchParams.get('startDate')
    ? dayjs(searchParams.get('startDate')).toDate()
    : null

  const router = useRouter()

  const [rates, setRates] = useState<Dictionary<Rate[]> | null>(null)

  const [selectedUnit, setSelectedUnit] = useState<UnitWithType | null>(
    booking?.unit || null
  )
  const [selectedGuestName, setSelectedGuestName] = useState<string | null>(
    booking?.guest?.name || null
  )
  const [selectedRateName, setSelectedRateName] = useState<string | null>(
    booking?.rate?.name || booking?.pricingMode || null
  )
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null)

  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: booking?.status || 'PENDING',
      guestId: booking?.guestId || '',
      period: {
        from: booking?.startDate || startDateParam || dayjs().toDate(),
        to: booking
          ? booking.endDate
          : startDateParam
            ? dayjs(startDateParam).add(1, 'day').toDate()
            : dayjs().add(1, 'day').toDate(),
      },
      unitId: booking?.unitId || unitIdParam || '',
      numberOfPeople: booking?.numberOfPeople || 1,
      rateId: booking?.rateId || '',
      daily: booking?.daily || 0,
      totalAmount: booking?.totalAmount || 0,
      pricingMode: booking?.pricingMode || 'MANUAL',
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.reset({
      status: booking?.status || 'PENDING',
      guestId: booking?.guestId || '',
      period: {
        from: booking?.startDate || startDateParam || dayjs().toDate(),
        to: booking
          ? booking.endDate
          : startDateParam
            ? dayjs(startDateParam).add(1, 'day').toDate()
            : dayjs().add(1, 'day').toDate(),
      },
      unitId: booking?.unitId || unitIdParam || '',
      numberOfPeople: booking?.numberOfPeople || 1,
      rateId: booking?.rateId || '',
      daily: booking?.daily || 0,
      totalAmount: booking?.totalAmount || 0,
      pricingMode: booking?.pricingMode || 'MANUAL',
    })
  }, [booking])

  const watchUnit = form.watch('unitId')
  const watchPeople = form.watch('numberOfPeople')
  const watchPeriod = form.watch('period')
  const watchDaily = form.watch('daily')
  const watchPricingMode = form.watch('pricingMode')
  const watchRateId = form.watch('rateId')

  useEffect(() => {
    if (!selectedUnit) {
      form.setValue('unitId', '')
      return
    }
    form.setValue('unitId', selectedUnit.id)
  }, [selectedUnit, form.setValue])

  useEffect(() => {
    if (!unitIdParam) return
    async function getUnit(id: string) {
      try {
        const res = await getUnitById(id)

        if (res.error || !res.data) throw new Error(res.error)

        setSelectedUnit(res.data)
        setError(null)
      } catch (error) {
        setSelectedUnit(null)
        setError((error as Error).message)
      }
    }

    getUnit(unitIdParam)
  }, [unitIdParam])

  useEffect(() => {
    if (!watchUnit) return
    async function getRates() {
      try {
        startTransition(async () => {
          const res = await groupedByRateNamePerUnit(watchUnit)

          if (res.error || !res.data) throw new Error(res.error)
          setRates(res.data)
          setError(null)
        })
      } catch (error) {
        setRates(null)
        setError((error as Error).message)
      }
    }
    getRates()
  }, [watchUnit])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!selectedRateName || !rates) return

    if (watchPricingMode === 'MANUAL' && selectedRateName === 'MANUAL') {
      form.setValue('rateId', '')
      return
    }

    if (watchPricingMode === 'RATE' && selectedRateName !== 'MANUAL') {
      const rateOptions = rates[selectedRateName] || []

      const sorted = rateOptions.sort(
        (a, b) => a.numberOfPeople - b.numberOfPeople
      )

      // Busca tarifa >= pessoas
      const matched = sorted.find(rate => rate.numberOfPeople >= watchPeople)

      const finalRate = matched || sorted[sorted.length - 1] // usa maior disponível se não encontrou

      setSelectedRate(finalRate || null)
      form.setValue('rateId', finalRate?.id || '')
    }
  }, [rates, selectedRateName, watchPeople])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!watchRateId || watchPricingMode === 'MANUAL') return
    form.setValue('daily', selectedRate?.value || 0)
  }, [watchRateId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!watchDaily || !watchPeriod) return
    form.setValue('daily', watchDaily)
    form.setValue(
      'totalAmount',
      watchDaily * dayjs(watchPeriod.to).diff(dayjs(watchPeriod.from), 'day')
    )
  }, [watchDaily, watchPeriod])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!watchDaily) return
    console.log(form.getValues())
  }, [watchDaily])

  async function onSubmit(values: BookingSchema) {
    if (booking) {
      startTransition(() => {
        updateBooking(booking.id, values).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success && data.booking) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setBooking(data.booking)
            setServerError(null)
            router.refresh()
            refetch()
          }
        })
      })
    } else {
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
            refetch()
            router.push('/bookings')
          }
        })
      })
    }
  }

  if (error) return <AlertErrorGlobal message={error} />

  return (
    <Card className="flex flex-col w-full h-full bg-sidebar dark:bg-muted">
      <CardHeader className="space-y-2 shrink-0">
        <CardTitle>
          Formulário da Reserva #{booking?.id && padNumber(booking?.id)}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-auto space-y-4 p-6">
        <BookingFormError
          errors={form.formState.errors}
          serverError={serverError}
        />
        <FormProvider {...form}>
          <form className="w-full space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status da reserva</FormLabel>
                  <BookingStatusCombobox
                    value={field.value}
                    onChange={field.onChange}
                    havePayments={
                      booking?.payments ? booking.payments.length > 0 : false
                    }
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
                    selectedGuestName={selectedGuestName}
                    setSelectedGuestName={setSelectedGuestName}
                    onChange={field.onChange}
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
                    period={field.value}
                    onChange={field.onChange}
                  />
                  <FormDescription>
                    Quantidade de dias:
                    {field.value.from && field.value.to
                      ? ` ${dayjs(field.value.to).diff(field.value.from, 'day')}`
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
                    bookingId={booking?.id}
                    selectedUnit={selectedUnit}
                    setSelectedUnit={setSelectedUnit}
                    onChange={field.onChange}
                  />
                  <FormDescription className="sr-only">
                    Selecione a acomodação da reserva
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
              name="rateId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tarifa</FormLabel>
                  <RatesCombobox
                    rates={rates}
                    selectedRateName={selectedRateName}
                    setSelectedRateName={setSelectedRateName}
                    setValue={form.setValue}
                    disabled={isPending}
                  />
                  <FormDescription className="sr-only">
                    Selecione uma tarifa para a reserva
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
                    disabled={watchPricingMode === 'RATE'}
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
          </form>
        </FormProvider>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-row py-4 px-6 justify-end">
        {booking ? (
          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-full"
              size={'sm'}
              onClick={() => {
                form.handleSubmit(onSubmit)()
              }}
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner size="sm" /> : 'Atualizar'}
            </Button>
            <BookingCancelAlertDialog bookingId={booking.id} />
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full"
            size={'sm'}
            onClick={() => {
              form.handleSubmit(onSubmit)()
            }}
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner size="sm" /> : 'Nova reserva'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
