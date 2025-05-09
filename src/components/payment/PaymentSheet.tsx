'use client'
import type { Payment } from '@/app/generated/prisma'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import calculateBookingValues from '@/lib/actions/calculateBookingValues'
import { formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { AlertCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookingEntriesDialog } from '../booking/BookingEntriesDialog '
import HugeiconsPayment01 from '../icons/HugeiconsPayment01'
import { Button } from '../ui/button'
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

  const getValueTotalBooking = (booking?: BookingAllIncludes) => {
    if (!booking) return

    const values = calculateBookingValues(booking)

    if (!values) return

    const balance = values.totalAll - values.totalPayment

    return balance
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
            <SheetDescription className="flex items-center justify-between gap-2 rounded-2xl border bg-slate-50 p-4 shadow-sm">
              <Link
                href={`/booking/${booking?.id}`}
                className="text-sm font-medium text-slate-500 mb-3"
              >
                {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
              </Link>
              {booking && (
                <BookingEntriesDialog
                  booking={booking}
                  open={dialogOpen}
                  setOpen={setDialogOpen}
                  payment={payment || undefined}
                >
                  <Button className="py-0 px-6 rounded-2xl ">
                    <HugeiconsPayment01 className="" />
                  </Button>
                </BookingEntriesDialog>
              )}
            </SheetDescription>
          </SheetHeader>

          {/* Lista de Pagamentos */}

          <div className="flex flex-col gap-2 rounded-2xl border bg-slate-50 p-4 shadow-sm">
            {booking?.payments.map(p => (
              <PaymentItemList
                key={p.id}
                payment={p}
                setPayment={setPayment}
                setOpenDialog={setDialogOpen}
                setOpenDeletePaymentDialog={setAlertDialogOpen}
                classname={
                  p.id === payment?.id ? 'bg-orange-200' : 'bg-blue-200'
                }
              />
            ))}
          </div>

          {/* Total */}
          <div className="rounded-2xl border bg-slate-50 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              Resumo Financeiro
            </h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>Total pago</span>
              </div>
              <span className="font-bold text-green-800">
                {formatCurrency(
                  booking?.payments.reduce((sum, p) => sum + p.amount, 0) || 0
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Falta lançar</span>
              </div>
              <span className="font-bold text-red-700">
                {formatCurrency(getValueTotalBooking(booking) || 0)}
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
