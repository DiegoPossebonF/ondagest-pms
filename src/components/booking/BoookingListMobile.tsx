import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  padNumber,
} from '@/lib/utils'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '../LoadingSpinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { useBookingFilters } from './BookingsFiltersProvider'

export function BookingsListMobile() {
  const router = useRouter()
  const { bookings, SortHeader, isPending } = useBookingFilters()
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-sidebar dark:bg-background text-left">
          <TableRow>
            <TableHead className="flex flex-row items-center justify-between h-12 p-2">
              <div className="flex flex-row gap-2">
                <div className="min-w-12 flex flex-row justify-center">
                  <SortHeader label="Nº" column="id" />
                </div>
                <div className="min-w-14 flex flex-row justify-center">
                  <SortHeader label="UH" column="unit" />
                </div>
                <SortHeader label="Hóspede" column="guest" />
              </div>
              <SortHeader label="Check In" column="startDate" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {isPending ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : bookings.length > 0 ? (
            bookings.map(booking => (
              <TableRow key={booking.id} className="border-0">
                <TableCell className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value={padNumber(booking.id, 5)}
                      className="border-0 text-muted-foreground"
                    >
                      <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                        <div className="flex flex-row items-center justify-between w-full text-xs font-normal">
                          <div className="flex flex-row gap-2">
                            <div className="min-w-12 flex flex-row justify-center">
                              <span className="font-semibold">
                                {padNumber(booking.id, 5) || 'N/A'}
                              </span>
                            </div>
                            <div className="min-w-14 flex flex-row justify-center">
                              <span>{booking.unit?.name || 'N/A'}</span>
                            </div>
                            <span>{booking.guest?.name || 'N/A'}</span>
                          </div>
                          <span>
                            {dayjs(booking.startDate).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-t pb-0 text-xs">
                        <div className="flex flex-row overflow-hidden text-xs font-normal border-b">
                          <div className="min-w-[100px] flex flex-col border-r bg-sidebar dark:bg-background">
                            <p className="text-right border-b p-2 font-semibold">
                              Período
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              Pessoas
                            </p>
                            <p className="text-right border-b px-2 py-[10.8px] font-semibold">
                              Status
                            </p>
                            <p className="text-right border-b px-2 py-[10.8px] font-semibold">
                              Pagamento
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              Total
                            </p>
                          </div>
                          <div className="w-full flex flex-col">
                            <p className="text-right border-b p-2">
                              {dayjs(booking.startDate).format('DD/MM/YYYY')} -{' '}
                              {dayjs(booking.endDate).format('DD/MM/YYYY')}
                            </p>
                            <p className="text-right border-b p-2">
                              {booking.numberOfPeople || 0}
                            </p>
                            <div className="text-right border-b p-2">
                              {booking.status ? (
                                <Badge
                                  className={STATUS_COLORS[booking.status]}
                                >
                                  {STATUS_LABELS[booking.status]}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </div>
                            <div className="text-right border-b p-2">
                              {booking.paymentStatus ? (
                                <Badge
                                  className={
                                    STATUS_PAYMENT_COLORS[booking.paymentStatus]
                                  }
                                >
                                  {STATUS_PAYMENT_LABELS[booking.paymentStatus]}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </div>
                            <div className="text-right border-b p-2">
                              {booking.totalAmount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </div>
                            <div className="flex flex-row overflow-hidden">
                              <Button
                                className="w-full rounded-none"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  router.push(`/bookings/${booking.id}`)
                                }}
                              >
                                Editar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Nenhuma reserva encontrada'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
