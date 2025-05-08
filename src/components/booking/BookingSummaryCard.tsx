'use client'
import type { Payment } from '@/app/generated/prisma'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import calculateBookingValues from '@/lib/actions/calculateBookingValues'
import { STATUS_COLORS, formatCurrency, getDifferenceInDays } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { useEffect, useState } from 'react'
import { PaymentAlertDialogDelete } from '../payment/PaymentAlertDialogDelete'
import { PaymentItemList } from '../payment/PaymentItemList'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { BookingEntriesDialog } from './BookingEntriesDialog '

interface BookingSummaryCardProps {
  booking: BookingAllIncludes
}

export function BookingSummaryCard({ booking }: BookingSummaryCardProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeletePaymentDialog, setOpenDeletePaymentDialog] = useState(false)
  const [payment, setPayment] = useState<Payment>()

  const { totalAll, totalPayment, totalServices, totalDiscount, totalAmount } =
    calculateBookingValues(booking)

  const balance = totalAll - totalPayment

  useEffect(() => {
    if (!openDialog && !openDeletePaymentDialog) {
      setPayment(undefined)
    }
  }, [openDialog, openDeletePaymentDialog])

  return (
    <>
      <BookingEntriesDialog
        booking={booking}
        open={openDialog}
        setOpen={setOpenDialog}
        payment={payment}
      />

      {payment && (
        <PaymentAlertDialogDelete
          open={openDeletePaymentDialog}
          setOpen={setOpenDeletePaymentDialog}
          payment={payment}
        />
      )}

      <Card className="overflow-hidden">
        <CardHeader className={`${booking && STATUS_COLORS[booking.status]}`}>
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
                        {discount.reason} — {formatCurrency(discount.amount)}
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
              <AccordionContent className="flex flex-col gap-1">
                {booking.payments.length > 0 ? (
                  booking.payments.map(p => (
                    <PaymentItemList
                      key={p.id}
                      payment={p}
                      setOpenDialog={setOpenDialog}
                      setOpenDeletePaymentDialog={setOpenDeletePaymentDialog}
                      setPayment={(payment: Payment) => setPayment(p)}
                      classname={payment?.id === p.id ? 'bg-orange-200' : ''}
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
    </>
  )
}
