'use client'
import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import { updateBookingStatus } from '@/app/actions/booking/updateBookingStatus'
import { BookingStatus } from '@/app/generated/prisma'
import {
  STATUS_COLORS,
  STATUS_COLORS_TEXT,
  STATUS_ICONS,
  STATUS_LABELS,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import { IconCalendarPlus, IconHome } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { BookingActionsSheet } from '../booking/BookingActionsSheet'
import { BookingDescriptions } from '../booking/BookingDescriptions'
import FluentDoor16Filled from '../icons/fluent-ui/FluentDoor16Filled'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface UnitCardProps {
  className?: string
  unit: UnitWithTypeAndBookings
  index: number
}

const validStatuses: BookingStatus[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
  BookingStatus.IN_PROGRESS,
  BookingStatus.CHECKED_OUT,
]

function getRelevantBooking(
  bookings: BookingAllIncludes[]
): { managerAction?: boolean; booking?: BookingAllIncludes } | null {
  const today = new Date()

  // 🔴 Primeiro, procurar reservas pendentes
  const pendent = bookings.find(
    booking =>
      booking.status === BookingStatus.PENDING &&
      new Date(booking.startDate) <= today
  )

  if (pendent) {
    return {
      managerAction: true,
      booking: pendent,
    }
  }

  // 🔴 Segundo, procurar reservas que deveriam ter iniciado mas ainda não fizeram check-in
  const started = bookings.find(
    booking =>
      booking.status === BookingStatus.CHECKED_IN &&
      new Date(booking.startDate) <= today
  )

  if (started) {
    return {
      managerAction: true,
      booking: started,
    }
  }

  // 🔴 Terceiro, procurar reservas que deveriam ter terminado mas não fizeram check-out
  const overdue = bookings.find(
    booking =>
      (booking.status === BookingStatus.CONFIRMED ||
        booking.status === BookingStatus.CHECKED_IN ||
        booking.status === BookingStatus.IN_PROGRESS ||
        booking.status === BookingStatus.CHECKED_OUT) &&
      new Date(booking.endDate) < today
  )

  if (overdue) {
    return {
      managerAction: true,
      booking: overdue,
    }
  }

  // ✅ Se não há overdue, segue fluxo padrão: reservas ativas que ainda não terminaram
  const filtered = bookings.filter(
    booking =>
      validStatuses.includes(booking.status) &&
      new Date(booking.endDate) >= today
  )

  if (filtered.length === 0) return null

  // Ordena pela data de início ascendente
  filtered.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  return {
    managerAction: false,
    booking: filtered[0],
  }
}

export default function UnitCard({ unit, index }: UnitCardProps) {
  const [openSheet, setOpenSheet] = useState(false)
  const router = useRouter()
  const relevantBooking = getRelevantBooking(unit.bookings)

  const booking = relevantBooking?.booking
  const managerAction = relevantBooking?.managerAction

  const StatusIcon = booking ? STATUS_ICONS[booking.status] : null

  const canFinalizeBooking = (booking: BookingAllIncludes): boolean => {
    const { totalAll, totalPayment } = calculateBookingValues(booking)
    // Só pode fazer check-out se já pagou tudo
    return totalPayment >= totalAll
  }

  const handleFinalizeBooking = async (booking: BookingAllIncludes) => {
    canFinalizeBooking(booking)
      ? await updateBookingStatus(booking.id, 'FINALIZED').then(() => {
          toast.success('Reserva finalizada', {
            description: 'A reserva foi finalizada com sucesso.',
          })
          router.refresh()
        })
      : toast.error('Pagamento pendente', {
          description: `Ainda faltam ${formatCurrency(calculateBookingValues(booking).totalAll - calculateBookingValues(booking).totalPayment)} para finalizar a reserva.`,
        })
  }

  const handleCheckIn = async (booking: BookingAllIncludes) => {
    await updateBookingStatus(booking.id, 'IN_PROGRESS').then(() => {
      toast('Check-in realizado', {
        description: 'O check-in foi realizado com sucesso.',
      })
      router.refresh()
    })
  }

  async function handleConfirmWithoutPayment(bookingId: number) {
    try {
      await updateBookingStatus(bookingId, 'CONFIRMED').then(() => {
        toast('Confirmado', {
          description: 'A reserva foi confirmada com sucesso.',
        })
        router.refresh()
      })

      // Atualizar estado ou refetch
    } catch (error) {
      toast('Erro ao confirmar', {
        description: 'Ocorreu um erro ao confirmar a reserva.',
      })
    }
  }

  return (
    <motion.div
      key={unit.name}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.2,
      }}
      className="h-full" // faz o motion.div ocupar toda a altura
    >
      <Card
        className={`relative flex flex-col h-full justify-between overflow-hidden text-ellipsis`}
      >
        <div
          className={`absolute left-0 top-0 h-full w-3 ${booking ? STATUS_COLORS[booking.status] : 'bg-muted-foreground'} z-10`}
        />
        <CardHeader className={`pr-4 pl-6 py-2 border-b justify-between`}>
          <CardTitle className="flex flex-row gap-2 justify-center items-center">
            <h1 className="text-base font-bold">{unit.name}</h1>
            <p className="text-sm"> {unit.type.name}</p>
          </CardTitle>
          <CardDescription className="font sr-only">
            {unit.name} - {unit.type.name} - {unit.type.description}
          </CardDescription>
          {/* Tooltip com ícone */}
          {booking ? (
            <Badge
              variant={'outline'}
              className={`${STATUS_COLORS_TEXT[booking.status]} flex items-center justify-center gap-1 px-2 py-[0.15rem] text-xs sm:text-sm`}
            >
              {StatusIcon && <StatusIcon className="w-4 h-4" />}
              <span className="text-xs">{STATUS_LABELS[booking.status]}</span>
            </Badge>
          ) : (
            <Badge
              variant={'outline'}
              className={`flex items-center justify-center gap-1 px-2 py-[0.15rem] text-xs sm:text-sm`}
            >
              <span className="text-xs">Livre</span>
            </Badge>
          )}
        </CardHeader>
        <CardContent className="px-6 py-2">
          {booking ? (
            <BookingDescriptions booking={booking} />
          ) : (
            <CardDescription className="flex flex-col justify-center items-center gap-2 text-sm font-semibold text-center">
              <FluentDoor16Filled className="w-12 h-12 text-muted-foreground" />
            </CardDescription>
          )}
        </CardContent>
        <CardFooter
          className={`p-2 gap-2 flex flex-row justify-center items-center border-t`}
        >
          {booking ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/bookings/${booking.id}`}>
                    <Button
                      size="icon"
                      className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                      variant="default"
                      title="Ir para reserva"
                    >
                      <IconHome className="h-4 w-4" />
                      <span className="sr-only">Ir para reserva</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ir para reserva</p>
                </TooltipContent>
              </Tooltip>

              <BookingActionsSheet
                booking={booking}
                openSheet={openSheet}
                setOpenSheet={setOpenSheet}
              />

              {managerAction && booking.status === 'PENDING' && (
                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          className={`size-8 group-data-[collapsible=icon]:opacity-0 ${STATUS_COLORS_TEXT[booking.status]}`}
                          variant="outline"
                        >
                          {StatusIcon && <StatusIcon className="h-4 w-4" />}
                          <span className="sr-only">
                            Confirmar sem pagamento
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Confirmar sem pagamento</p>
                    </TooltipContent>
                  </Tooltip>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja confirmar a reserva sem
                        pagamento?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="sr-only">
                      Fazer check-in sem pagamento
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleConfirmWithoutPayment(booking.id)}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {managerAction && booking.status === 'CHECKED_IN' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCheckIn(booking)}
                      className={`size-8 group-data-[collapsible=icon]:opacity-0 ${STATUS_COLORS_TEXT[booking.status]}`}
                    >
                      {StatusIcon && <StatusIcon className="h-4 w-4" />}
                      <span className="sr-only">Fazer check-in</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fazer check-in</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {managerAction && booking.status === 'CHECKED_OUT' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleFinalizeBooking(booking)}
                      className={`size-8 group-data-[collapsible=icon]:opacity-0 ${STATUS_COLORS_TEXT[booking.status]}`}
                    >
                      {StatusIcon && <StatusIcon className="h-4 w-4" />}
                      <span className="sr-only">Fazer check-out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fazer check-out</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/bookings/new`}>
                  <Button
                    size="icon"
                    variant="outline"
                    className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                  >
                    <IconCalendarPlus className="w-4 h-4" />
                    <span className="sr-only">Fazer reserva</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fazer reserva</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
