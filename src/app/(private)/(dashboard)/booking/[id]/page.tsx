import { BookingEntriesDialog } from '@/components/booking/BookingEntriesDialog '
import { BookingForm } from '@/components/booking/BookingForm'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

              <CardContent className="text-sm">
                <Accordion type="multiple" className="w-full space-y-1">
                  {/* Nº de diárias */}
                  <AccordionItem
                    value="nights"
                    className="border-none flex justify-between flex-row"
                  >
                    <span className="font-medium">Nº de diárias</span>
                    <span>
                      {getDifferenceInDays({
                        from: booking?.startDate,
                        to: booking?.endDate,
                      })}
                    </span>
                  </AccordionItem>

                  {/* Valor diária */}
                  <AccordionItem
                    value="daily-value"
                    className="border-none flex justify-between flex-row"
                  >
                    <span className="font-medium">Valor diária</span>
                    <span>
                      {formatCurrency(
                        totalAmount /
                          getDifferenceInDays({
                            from: booking?.startDate,
                            to: booking?.endDate,
                          })
                      )}
                    </span>
                  </AccordionItem>

                  {/* Total diárias */}
                  <AccordionItem value="daily-total" className="border-none">
                    <AccordionTrigger className="pointer-events-none justify-between text-left">
                      <span className="font-medium">Total diárias</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </AccordionTrigger>
                  </AccordionItem>

                  {/* Serviços */}
                  <AccordionItem value="services">
                    <AccordionTrigger>Serviços</AccordionTrigger>
                    <AccordionContent>
                      {booking.services.length > 0 ? (
                        <ul className="pl-4 list-disc">
                          {booking.services.map(service => (
                            <li key={service.id}>
                              {service.name} — {formatCurrency(service.amount)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Nenhum serviço lançado
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Descontos */}
                  <AccordionItem value="discounts">
                    <AccordionTrigger>Desconto</AccordionTrigger>
                    <AccordionContent>
                      {booking.discounts.length > 0 ? (
                        <ul className="pl-4 list-disc">
                          {booking.discounts.map(discount => (
                            <li key={discount.id}>
                              {discount.reason} —{' '}
                              {formatCurrency(discount.amount)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Nenhum desconto aplicado
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Total */}
                  <AccordionItem value="total" className="border-none">
                    <AccordionTrigger className="pointer-events-none justify-between text-left">
                      <span className="font-medium">Total</span>
                      <span>{formatCurrency(totalAll)}</span>
                    </AccordionTrigger>
                  </AccordionItem>

                  {/* Pagamentos */}
                  <AccordionItem value="payments">
                    <AccordionTrigger>Recebido</AccordionTrigger>
                    <AccordionContent>
                      {booking.payments.length > 0 ? (
                        <ul className="pl-4 list-disc">
                          {booking.payments.map(payment => (
                            <li key={payment.id}>
                              {payment.paymentType} —{' '}
                              {formatCurrency(payment.amount)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Nenhum pagamento registrado
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Falta lançar */}
                  <AccordionItem value="balance" className="border-none">
                    <AccordionTrigger className="pointer-events-none justify-between text-left font-semibold">
                      <span className="font-medium">Falta lançar</span>
                      <span
                        className={
                          balance > 0 ? 'text-red-500' : 'text-green-500'
                        }
                      >
                        {formatCurrency(balance)}
                      </span>
                    </AccordionTrigger>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
