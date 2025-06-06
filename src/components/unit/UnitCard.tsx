'use client'
import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import { updateBookingStatus } from '@/app/actions/booking/updateBookingStatus'
import { BookingStatus } from '@/app/generated/prisma'
import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'
import {
  STATUS_COLORS,
  STATUS_COLORS_TEXT,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS_TEXT,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import { IconDoor } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookingCardButton } from '../booking/BookingCardButton'
import { BookingDescriptions } from '../booking/BookingDescriptions'
import { BookingSheet } from '../booking/BookingSheet'
import MaterialSymbolsRealEstateAgent from '../icons/MaterialSymbolsRealEstateAgent'
import MageCalendarPlusFill from '../icons/mage/MageCalendarPlusFill'
import MdiBookEdit from '../icons/mdi/MdiBookEdit'
import { PaymentSheet } from '../payment/PaymentSheet'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface UnitCardProps {
  className?: string
  unit: UnitWithTypeAndBookings
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

export default function UnitCard({ unit }: UnitCardProps) {
  const { toast } = useToast()
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
          toast({
            title: 'Reserva finalizada',
            description: 'A reserva foi finalizada com sucesso.',
          })
          router.refresh()
        })
      : toast({
          variant: 'destructive',
          title: 'Pagamento pendente',
          description: `Ainda faltam ${formatCurrency(calculateBookingValues(booking).totalAll - calculateBookingValues(booking).totalPayment)} para finalizar a reserva.`,
        })
  }

  const handleCheckIn = async (booking: BookingAllIncludes) => {
    await updateBookingStatus(booking.id, 'IN_PROGRESS').then(() => {
      toast({
        title: 'Check-in realizado',
        description: 'O check-in foi realizado com sucesso.',
      })
      router.refresh()
    })
  }

  async function handleConfirmWithoutPayment(bookingId: number) {
    try {
      await updateBookingStatus(bookingId, 'CONFIRMED').then(() => {
        toast({
          title: 'Confirmado',
          description: 'A reserva foi confirmada com sucesso.',
        })
        router.refresh()
      })

      // Atualizar estado ou refetch
    } catch (error) {
      toast({
        title: 'Erro ao confirmar',
        description: 'Ocorreu um erro ao confirmar a reserva.',
      })
    }
  }

  const isMobile = useIsMobile()

  return (
    <Card
      className={`relative flex flex-col justify-between overflow-hidden text-ellipsis`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-2 ${booking ? STATUS_COLORS[booking.status] : 'bg-muted-foreground'} z-10`}
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
            className={`flex items-center justify-center gap-1 px-2 py-[0.15rem] text-xs sm:text-sm`}
          >
            {StatusIcon && <StatusIcon className="w-4 h-4" />}
            <span className="hidden sm:inline text-xs">
              {STATUS_LABELS[booking.status]}
            </span>
          </Badge>
        ) : (
          <Badge
            variant={'outline'}
            className={`flex items-center justify-center gap-1 px-2 py-[0.15rem] text-xs sm:text-sm`}
          >
            <span className="hidden sm:inline text-xs">Livre</span>
          </Badge>
        )}
      </CardHeader>
      <CardContent className="px-6 py-2">
        {booking ? (
          <BookingDescriptions booking={booking} />
        ) : (
          <CardDescription className="flex flex-col justify-center items-center gap-2 text-sm font-semibold text-center">
            <IconDoor className="w-12 h-12 text-muted-foreground" />
          </CardDescription>
        )}
      </CardContent>
      <CardFooter
        className={`p-2 gap-2 flex flex-row justify-center items-center border-t`}
      >
        {booking ? (
          <>
            <PaymentSheet booking={booking}>
              <BookingCardButton
                className={`${STATUS_PAYMENT_COLORS_TEXT[booking.paymentStatus]}`}
                title="Lançar pagamento"
              >
                <MaterialSymbolsRealEstateAgent className="h-4 w-4" />
              </BookingCardButton>
            </PaymentSheet>
            <Link href={`/bookings/${booking.id}`} title="Ir para a reserva">
              <BookingCardButton className="text-primary/90 hover:text-primary">
                <MdiBookEdit className="h-4 w-4" />
              </BookingCardButton>
            </Link>
            {managerAction && booking.status === 'PENDING' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <BookingCardButton
                    className={`${STATUS_COLORS_TEXT[booking.status]}`}
                    title="Confirmar reserva sem pagamento"
                  >
                    {StatusIcon && <StatusIcon className="h-4 w-4" />}
                  </BookingCardButton>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja confirmar a reserva sem pagamento?
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
              <BookingCardButton
                onClick={() => handleCheckIn(booking)}
                className={`${STATUS_COLORS_TEXT[booking.status]}`}
                title="Fazer Check-in"
              >
                {StatusIcon && <StatusIcon className="h-4 w-4" />}
              </BookingCardButton>
            )}
            {managerAction && booking.status === 'CHECKED_OUT' && (
              <BookingCardButton
                onClick={() => handleFinalizeBooking(booking)}
                className={`${STATUS_COLORS_TEXT[booking.status]}`}
                title="Fazer Check-out"
              >
                {StatusIcon && <StatusIcon className="h-4 w-4" />}
              </BookingCardButton>
            )}
          </>
        ) : (
          <BookingSheet startDate={dayjs()} unit={unit}>
            <BookingCardButton className="text-muted-foreground/90 hover:text-muted-foreground">
              <MageCalendarPlusFill className="w-4 h-4" />
            </BookingCardButton>
          </BookingSheet>
        )}
      </CardFooter>
    </Card>
  )
}
