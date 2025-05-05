import { BookingEntriesDialog } from '@/components/booking/BookingEntriesDialog '
import { BookingForm } from '@/components/booking/BookingForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import calculateBookingValues from '@/lib/actions/calculateBookingValues'
import db from '@/lib/db'
import { STATUS_COLORS, formatCurrency, getDifferenceInDays } from '@/lib/utils'

export default async function BookingId({
  params,
}: { params: { id: string } }) {
  const { id } = await params

  const booking = await db.booking.findUnique({
    where: { id: Number(id) },
    include: {
      guest: true,
      unit: { include: { type: { include: { rates: true } } } },
      payments: true,
      discounts: true,
      services: true,
    },
  })

  if (!booking) {
    throw new Error('Reserva não encontrada')
  }

  const { totalAll, totalPayment, totalServices, totalDiscount, totalAmount } =
    calculateBookingValues(booking)

  const balance = totalAll - totalPayment

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>RESERVA</span>
        <BookingEntriesDialog booking={booking} />
      </div>
      <div className="p-6 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="md:basis-3/5">
            <Card className="overflow-hidden">
              <CardHeader
                className={`${booking && STATUS_COLORS[booking.status]}`}
              >
                <CardTitle>{`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.status}`}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BookingForm booking={booking ? booking : undefined} />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col md:basis-2/5 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>RESUMO DA RESERVA</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Nº de diárias
                      </TableCell>
                      <TableCell className="text-right">
                        {getDifferenceInDays({
                          from: booking?.startDate,
                          to: booking?.endDate,
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Valor diária
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          totalAmount /
                            getDifferenceInDays({
                              from: booking?.startDate,
                              to: booking?.endDate,
                            })
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Total diárias
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Serviços</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalServices)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Desconto</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalDiscount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalAll)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Recebido</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalPayment)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Falta lançar
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {formatCurrency(balance)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
