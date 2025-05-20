'use client'
import type { Discount, Payment, Service } from '@/app/generated/prisma'
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
import { DiscountItemList } from '../discount/DiscountItemList'
import { PaymentAlertDialogDelete } from '../payment/PaymentAlertDialogDelete'
import { PaymentItemList } from '../payment/PaymentItemList'
import { ServiceAlertDialogDelete } from '../service/ServiceAlertDialogDelete'
import { ServiceItemList } from '../service/ServiceItemList'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { BookingEntriesDialog } from './BookingEntriesDialog '

interface BookingSummaryCardProps {
  booking: BookingAllIncludes
}

export function BookingSummaryCard({ booking }: BookingSummaryCardProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeletePaymentDialog, setOpenDeletePaymentDialog] = useState(false)
  const [openDeleteServiceDialog, setOpenDeleteServiceDialog] = useState(false)
  const [payment, setPayment] = useState<Payment>()
  const [service, setService] = useState<Service>()
  const [discount, setDiscount] = useState<Discount>()

  const { totalAll, totalPayment, totalServices, totalDiscount, totalAmount } =
    calculateBookingValues(booking)

  const balance = totalAll - totalPayment

  useEffect(() => {
    if (!openDialog && !openDeletePaymentDialog && !openDeleteServiceDialog) {
      setPayment(undefined)
      setService(undefined)
    }
  }, [openDialog, openDeletePaymentDialog, openDeleteServiceDialog])

  return (
    <>
      <BookingEntriesDialog
        booking={booking}
        open={openDialog}
        setOpen={setOpenDialog}
        payment={payment}
        service={service}
      />

      {payment && (
        <PaymentAlertDialogDelete
          open={openDeletePaymentDialog}
          setOpen={setOpenDeletePaymentDialog}
          payment={payment}
        />
      )}

      {service && (
        <ServiceAlertDialogDelete
          open={openDeleteServiceDialog}
          setOpen={setOpenDeleteServiceDialog}
          service={service}
        />
      )}

      <Card className="overflow-hidden">
        <CardHeader className={`${booking && STATUS_COLORS[booking.status]}`}>
          <CardTitle>RESUMO DA RESERVA</CardTitle>
        </CardHeader>

        <CardContent className="text-sm p-0">
          <Accordion type="multiple" className="w-full space-y-0">
            {/* Nº de diárias */}
            <AccordionItem
              value="nights"
              className="flex justify-between flex-row py-2 px-6 border hadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200"
            >
              <span className="font-medium">Nº de diárias</span>
              <span className="text-sm font-mono font-bold">
                {getDifferenceInDays({
                  from: booking?.startDate,
                  to: booking?.endDate,
                })}
              </span>
            </AccordionItem>

            {/* Valor diária */}
            <AccordionItem
              value="daily-value"
              className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200"
            >
              <span className="font-medium">Valor diária</span>
              <span className="text-sm font-mono">
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
              className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200"
            >
              <span className="font-medium">Total diárias</span>
              <span className="text-sm font-mono">
                {formatCurrency(totalAmount)}
              </span>
            </AccordionItem>

            {/* Serviços */}
            <AccordionItem value="services" className="border-none">
              <div className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200">
                <AccordionTrigger className="py-0 gap-2">
                  <span className="font-medium">Serviços</span>
                </AccordionTrigger>
                <span className="text-sm font-mono">
                  {formatCurrency(totalServices)}
                </span>
              </div>

              <AccordionContent className="flex flex-col gap-1 border bg-slate-50 p-2 shadow-sm">
                {booking.services.length > 0 ? (
                  booking.services.map(s => (
                    <ServiceItemList
                      key={s.id}
                      service={s}
                      setOpenDialog={setOpenDialog}
                      setOpenDelete={setOpenDeleteServiceDialog}
                      setService={(service: Service) => setService(s)}
                      classname={service?.id === s.id ? 'bg-orange-200' : ''}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Nenhum serviço lançado
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Descontos */}
            <AccordionItem value="discounts" className="border-none">
              <div className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200">
                <AccordionTrigger className="py-0 gap-2">
                  <span className="font-medium">Descontos</span>
                </AccordionTrigger>
                <span className="text-sm font-mono">
                  {formatCurrency(totalDiscount)}
                </span>
              </div>
              <AccordionContent className="flex flex-col gap-1 border bg-slate-50 p-2 shadow-sm">
                {booking.discounts.length > 0 ? (
                  booking.discounts.map(d => (
                    <DiscountItemList
                      key={d.id}
                      discount={d}
                      setOpenDialog={setOpenDialog}
                      setOpenDelete={setOpenDeleteServiceDialog}
                      setDiscount={(discount: Discount) => setDiscount(d)}
                      classname={discount?.id === d.id ? 'bg-orange-200' : ''}
                    />
                  ))
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
              className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200"
            >
              <span className="font-medium">Total</span>
              <span className="text-sm font-mono">
                {formatCurrency(totalAll)}
              </span>
            </AccordionItem>

            {/* Pagamentos */}
            <AccordionItem value="payments" className="border-none">
              <div className="flex justify-between flex-row py-2 px-6 border shadow-sm bg-gray-900 hover:bg-gray-800 text-blue-200">
                <AccordionTrigger className="py-0 gap-2">
                  <span className="font-medium">Pagamentos</span>
                </AccordionTrigger>
                <span className="text-sm font-mono">
                  {formatCurrency(totalPayment)}
                </span>
              </div>
              <AccordionContent className="flex flex-col gap-1 border bg-slate-50 p-2 shadow-sm">
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
              className="flex justify-between flex-row py-2 px-6 border shadow-sm rounded-br-xl rounded-bl-xl bg-gray-900 hover:bg-gray-800 text-blue-200"
            >
              <span className="font-medium">Saldo pendente</span>
              <span
                className={
                  balance > 0
                    ? 'text-red-500 text-sm font-mono'
                    : 'text-green-500 text-sm font-mono'
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
