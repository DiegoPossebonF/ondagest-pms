'use client'
import type { Payment } from '@/app/generated/prisma'
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
import { formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookingEntriesDialog } from '../booking/BookingEntriesDialog '
import { PaymentAlertDialogDelete } from './PaymentAlertDialogDelete'
import { PaymentItemList } from './PaymentItemList'

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
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          onInteractOutside={(event: any) => {
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
                <PaymentItemList
                  key={p.id}
                  payment={p}
                  setPayment={setPayment}
                  setOpenDialog={setDialogOpen}
                  setOpenDeletePaymentDialog={setAlertDialogOpen}
                />
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col justify-between font-semibold text-base p-4 border-2 rounded-lg bg-slate-100">
            <div className="w-full flex justify-between">
              <span>Total pago</span>
              <span className="font-extrabold text-green-700">
                {formatCurrency(
                  booking?.payments.reduce((sum, p) => sum + p.amount, 0) || 0
                )}
              </span>
            </div>
            <div className="w-full flex justify-between">
              <span>Falta lançar</span>
              <span className="font-extrabold text-red-500">
                {formatCurrency(getValueTotalBooking(booking) || 0)}
              </span>
            </div>
          </div>
          <SheetFooter>
            {/* Novo Pagamento */}
            <div className="flex justify-end">
              {booking && (
                <BookingEntriesDialog
                  booking={booking}
                  open={dialogOpen}
                  setOpen={setDialogOpen}
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
