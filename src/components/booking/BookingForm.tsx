'use client'
import { createBooking } from '@/actions/booking/createBooking'
import { updateBooking } from '@/actions/booking/updateBooking'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMediaQuery } from '@/hooks/use-media-query'
import { getDifferenceInDays } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { Rate } from '@/types/rate'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import { zodResolver } from '@hookform/resolvers/zod'
import type dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { GuestCombobox } from '../guest/GuestCombobox'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { UnitCombobox } from '../unit/UnitCombobox'
import { BookingCalendar } from './BookingCalendar'

const bookingSchema = z.object({
  guestId: z.string().min(1, 'O ID do hóspede é obrigatório'),
  period: z
    .object({
      from: z.date({ required_error: 'A data inicial é obrigatória' }),
      to: z.date().optional(),
    })
    .refine(data => !data.to || data.from <= data.to, {
      message: 'A data final deve ser maior ou igual à data inicial',
      path: ['to'],
    }),
  unitId: z.string().min(1, 'O ID da unidade é obrigatório'),
  // status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  numberOfPeople: z.coerce
    .number()
    .int()
    .positive('O número de pessoas deve ser maior que 0'),
  totalAmount: z.coerce
    .number()
    .nonnegative('O valor total não pode ser negativo'),
})
// .refine(object => object.endDate > object.startDate, {
//   message: 'A data de check-out deve ser maior que a data de check-in',
// })

export type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingFormProps {
  booking?: BookingAllIncludes
  startDate?: dayjs.Dayjs
  unit?: UnitWithTypeAndBookings
  setOpenSheet?: Dispatch<SetStateAction<boolean>>
  setBookings?: React.Dispatch<React.SetStateAction<BookingAllIncludes[]>>
}

export function BookingForm({
  booking,
  startDate,
  unit,
  setOpenSheet,
  setBookings,
}: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rates, setRates] = useState<Rate[]>(booking?.unit?.type?.rates || [])
  const [daily, setDaily] = useState(0)
  const [isButtonSizeFull, setIsButtonSizeFull] = useState(false)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestId: booking?.guestId,
      period: {
        from: booking?.startDate || startDate?.toDate(),
        to: booking?.endDate || startDate?.add(1, 'day').toDate(),
      },
      unitId: booking?.unitId || unit?.id,
      // status:
      //   bookingSelected.status === 'CHECKED_IN' ||
      //   bookingSelected.status === 'CHECKED_OUT'
      //     ? 'PENDING'
      //     : bookingSelected.status || 'PENDING',
      numberOfPeople: booking?.numberOfPeople || 0,
      totalAmount: booking?.totalAmount || 0,
    },
  })

  const { setValue, getValues, handleSubmit, control, watch } = form

  const unitId = watch('unitId')
  const period = watch('period')

  const findClosestRate = (peopleCount: number) => {
    if (!rates.length) return { value: 0, numberOfPeople: 0 }
    return rates.reduce((closest, rate) => {
      return Math.abs(rate.numberOfPeople - peopleCount) <
        Math.abs(closest.numberOfPeople - peopleCount)
        ? rate
        : closest
    }, rates[0]) // Inicia assumindo que a primeira opção é a mais próxima
  }

  const setDailyAndTotalAmount = (numberOfPeople: number, daily?: number) => {
    if (daily) {
      setValue('totalAmount', daily * getDifferenceInDays(getValues('period')))
      setDaily(daily)
    } else {
      setValue(
        'totalAmount',
        findClosestRate(numberOfPeople).value *
          getDifferenceInDays(getValues('period'))
      )
      setDaily(findClosestRate(numberOfPeople).value)
    }
  }

  useEffect(() => {
    // Se a tela for menor que lg, minimize
    setIsButtonSizeFull(!isLargeScreen)
  }, [isLargeScreen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (booking) {
      setDaily(
        booking.totalAmount /
          getDifferenceInDays({
            from: booking.startDate,
            to: booking.endDate,
          })
      )
    } else {
      setDailyAndTotalAmount(getValues('numberOfPeople'))
    }
  }, [unitId])

  async function onSubmitHandle(
    values: BookingFormValues,
    event: React.FormEvent
  ) {
    try {
      if (booking) {
        const data = await updateBooking(values, booking.id)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Reserva atualizada com sucesso',
          })
          setBookings?.(prev => {
            return prev.map(b => (b.id === booking.id ? data.booking : b))
          })
          router.refresh()
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      } else {
        const data = await createBooking(values)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Reserva criada com sucesso',
          })

          setBookings?.(prev => [...prev, data])
          router.refresh()
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast('Erro', {
          description: error.message,
        })
      } else {
        toast('Erro', {
          description: 'Erro desconhecido, tente novamente mais tarde',
        })
      }
    } finally {
      setLoading(false)
      setOpenSheet?.(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <Form {...form}>
        <form
          onSubmit={event =>
            handleSubmit(values => onSubmitHandle(values, event))(event)
          }
          className="space-y-4"
        >
          <FormField
            control={control}
            name="guestId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Hóspede</FormLabel>
                <GuestCombobox
                  setValue={setValue}
                  guestId={watch('guestId')}
                  guestName={booking?.guest.name}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="period"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Período</FormLabel>
                <BookingCalendar period={watch('period')} setValue={setValue} />
                <FormDescription>
                  Total de {getDifferenceInDays(watch('period'))} diárias.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="unitId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>UH</FormLabel>
                <UnitCombobox
                  setValue={setValue}
                  setRates={setRates}
                  unitId={watch('unitId')}
                  period={watch('period')}
                  unitName={booking?.unit.name || unit?.name}
                  bookingId={booking?.id}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Número de Pessoas */}
          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">
                  Quantidade de pessoas
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Informe a quantidade de pessoas"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    onChange={e => {
                      setValue('numberOfPeople', Number(e.target.value))
                      setDailyAndTotalAmount(Number(e.target.value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Valor Diária */}
          <FormItem className="space-y-0">
            <FormLabel className="font-semibold">Diária</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={daily}
                placeholder="Valor da diária"
                className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                onChange={e => {
                  setDailyAndTotalAmount(
                    watch('numberOfPeople'),
                    Number(e.target.value)
                  )
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* Campo de Valor Total */}
          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Valor total</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Informe o valor total"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          {/* Botão de Envio */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className={`${isButtonSizeFull ? 'w-full' : ''} mt-4`}
              variant={'destructive'}
            >
              {loading ? 'Cancelando...' : 'Cancelar'}
            </Button>
            <Button
              type="submit" // Alteramos de "submit" para "button"
              className={`${isButtonSizeFull ? 'w-full' : ''} mt-4`}
            >
              {loading
                ? booking
                  ? 'Atualizando...'
                  : 'Reservando...'
                : booking
                  ? 'Atualizar'
                  : 'Reservar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
