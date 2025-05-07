import { ItemList } from '@/components/ItemList'
import { BookingEntriesDialog } from '@/components/booking/BookingEntriesDialog '
import { BookingForm } from '@/components/booking/BookingForm'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import calculateBookingValues from '@/lib/actions/calculateBookingValues'
import db from '@/lib/db'
import { STATUS_COLORS, formatCurrency, getDifferenceInDays } from '@/lib/utils'
import { Plus } from 'lucide-react'

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
        <BookingEntriesDialog booking={booking}>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </BookingEntriesDialog>
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
            <Card className="overflow-hidden">
              <CardHeader
                className={`${booking && STATUS_COLORS[booking.status]}`}
              >
                <CardTitle>RESUMO DA RESERVA</CardTitle>
              </CardHeader>

              <CardContent className="text-sm p-6">
                <Accordion type="multiple" className="w-full space-y-1">
                  {/* Nº de diárias */}
                  <AccordionItem
                    value="nights"
                    className="flex justify-between flex-row py-2"
                  >
                    <span className="font-medium">Nº de diárias</span>
                    <span className="text-muted-foreground">
                      {getDifferenceInDays({
                        from: booking?.startDate,
                        to: booking?.endDate,
                      })}
                    </span>
                  </AccordionItem>

                  {/* Valor diária */}
                  <AccordionItem
                    value="daily-value"
                    className="flex justify-between flex-row py-2"
                  >
                    <span className="font-medium">Valor diária</span>
                    <span className="text-muted-foreground">
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
                  <AccordionItem
                    value="daily-total"
                    className="flex justify-between flex-row py-2"
                  >
                    <span className="font-medium">Total diárias</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(totalAmount)}
                    </span>
                  </AccordionItem>

                  {/* Serviços */}
                  <AccordionItem value="services">
                    <div className="flex justify-between flex-row py-2">
                      <AccordionTrigger className="py-0">
                        <span className="font-medium">Serviços</span>
                      </AccordionTrigger>
                      <span className="text-muted-foreground">
                        {formatCurrency(totalServices)}
                      </span>
                    </div>

                    <AccordionContent>
                      {booking.services.length > 0 ? (
                        <ul className="pl-4">
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
                    <div className="flex justify-between flex-row py-2">
                      <AccordionTrigger className="py-0">
                        <span className="font-medium">Descontos</span>
                      </AccordionTrigger>
                      <span className="text-muted-foreground">
                        {formatCurrency(totalDiscount)}
                      </span>
                    </div>
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
                  <AccordionItem
                    value="total"
                    className="flex justify-between flex-row py-2"
                  >
                    <span className="font-medium">Total</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(totalAll)}
                    </span>
                  </AccordionItem>

                  {/* Pagamentos */}
                  <AccordionItem value="payments">
                    <div className="flex justify-between flex-row py-2">
                      <AccordionTrigger className="py-0">
                        <span className="font-medium">Pagamentos</span>
                      </AccordionTrigger>
                      <span className="text-muted-foreground">
                        {formatCurrency(totalPayment)}
                      </span>
                    </div>
                    <AccordionContent>
                      {booking.payments.length > 0 ? (
                        booking.payments.map(payment => (
                          <ItemList
                            key={payment.id}
                            amount={payment.amount}
                            paymentType={payment.paymentType}
                            booking={booking}
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Nenhum pagamento lançado
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Falta lançar */}
                  <AccordionItem
                    value="balance"
                    className="border-none flex justify-between flex-row py-2"
                  >
                    <span className="font-medium">Saldo pendente</span>
                    <span
                      className={
                        balance > 0
                          ? 'text-red-500 font-semibold'
                          : 'text-green-500 font-semibold'
                      }
                    >
                      {formatCurrency(balance)}
                    </span>
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
