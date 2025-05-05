'use client'
import type { Payment } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import calculateBookingValues from '@/lib/actions/calculateBookingValues'
import { PAYMENT_TYPE_LABELS, formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { PaymentAlertDialogDelete } from './PaymentAlertDialogDelete'
import { PaymentDialog } from './PaymentDialog'

interface PaymentSheetProps {
  booking?: BookingAllIncludes
  children: React.ReactNode
}

export function PaymentSheet({ booking, children }: PaymentSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [payment, setPayment] = useState<Payment | null>(null)

  useEffect(() => {
    if (!dialogOpen) {
      setPayment(null)
    }
  }, [dialogOpen])

  useEffect(() => {
    if (!alertDialogOpen) {
      setPayment(null)
    }
  }, [alertDialogOpen])

  const openEditDialog = (payment: Payment) => {
    setPayment(payment)
    setDialogOpen(true)
  }

  const openDeleteDialog = (payment: Payment) => {
    setPayment(payment)
    setAlertDialogOpen(true)
  }

  const getValueTotalBooking = (booking?: BookingAllIncludes) => {
    if (!booking) return

    const values = calculateBookingValues(booking)

    if (!values) return

    const resto = values.totalAll - values.totalPayment

    return resto
  }

  return (
    <>
      {payment && (
        <PaymentAlertDialogDelete
          open={alertDialogOpen}
          setOpen={setAlertDialogOpen}
          payment={payment}
          bookingId={booking?.id}
          setPayment={setPayment}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          onInteractOutside={event => {
            dialogOpen && event.preventDefault()
          }}
          className="flex flex-col max-h-screen"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">Pagamentos</SheetTitle>
            <SheetDescription>
              <Link href={`/booking/${booking?.id}`}>
                {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
              </Link>
            </SheetDescription>
          </SheetHeader>

          {/* Lista de Pagamentos */}
          <div className="flex-1 overflow-y-auto p-4 border-2 rounded-lg bg-slate-100">
            <div className="flex flex-col gap-2">
              {booking?.payments.map(p => (
                <div
                  key={p.id}
                  className={`flex justify-between min-w-[300px] items-center border rounded-lg p-2 px-3 shadow-sm  ${payment?.id === p.id ? 'bg-orange-200' : 'bg-white'}`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{formatCurrency(p.amount)}</p>
                    <div className="flex gap-1">
                      <Badge className="font-mono text-[10px] text-blue-300">
                        {dayjs(p.paidAt).format('DD/MM/YYYY')}
                      </Badge>
                      <Badge
                        className="font-mono text-[10px] text-blue-300"
                        title={PAYMENT_TYPE_LABELS[p.paymentType]}
                      >
                        {PAYMENT_TYPE_LABELS[p.paymentType]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center pl-2 w-12">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 p-1"
                      onClick={() => openEditDialog(p)}
                    >
                      <Pencil className="!w-3 !h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 p-1"
                      onClick={() => openDeleteDialog(p)}
                    >
                      <Trash2 className="!w-3 !h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col justify-between font-semibold text-base p-4 border-2 rounded-lg bg-slate-100">
            <div className="w-full flex justify-between">
              <span>Total Pago</span>
              <span className="font-extrabold text-green-700">
                {formatCurrency(
                  booking?.payments.reduce((sum, p) => sum + p.amount, 0) || 0
                )}
              </span>
            </div>
            <div className="w-full flex justify-between">
              <span>Falta Pagar</span>
              <span className="font-extrabold text-red-500">
                {getValueTotalBooking(booking)}
              </span>
            </div>
          </div>
          <SheetFooter>
            {/* Novo Pagamento */}
            <div className="flex justify-end">
              {booking && (
                <PaymentDialog
                  dialogOpen={dialogOpen}
                  sheetOpen={sheetOpen}
                  setDialogOpen={setDialogOpen}
                  booking={booking}
                  payment={payment || undefined}
                />
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
