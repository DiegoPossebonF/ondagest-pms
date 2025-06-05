'use client'
import calculateBookingValues from '@/app/actions/booking/calculateBookingValues'
import type { Payment } from '@/app/generated/prisma'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { AlertCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookingEntriesDialog } from '../booking/BookingEntriesDialog '
import MaterialSymbolsRealEstateAgent from '../icons/MaterialSymbolsRealEstateAgent'
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
          className="flex flex-col gap-0 max-h-screen bg-sidebar-bg"
        >
          <SheetHeader className="flex flex-col rounded-tl-2xl rounded-tr-2xl border bg-slate-50 p-4 shadow-sm mt-4">
            <SheetTitle className="text-2xl">Pagamentos</SheetTitle>
            <SheetDescription className="hidden">
              {`Este painel permite consultar e adicionar pagamentos para a reserva ${booking?.id}.`}
            </SheetDescription>
            <div className="flex flex-row items-center justify-between gap-2">
              <Link
                href={`/booking/${booking?.id}`}
                className="text-sm font-medium text-slate-500"
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
                  <div
                    title="Lançar Pagamento"
                    className="flex items-center justify-center py-1 px-4 bg-gray-900 hover:bg-gray-800 text-blue-200 hover:text-blue-300 cursor-pointer rounded-lg overflow-hidden"
                  >
                    <MaterialSymbolsRealEstateAgent className="w-5 h-5" />
                  </div>
                </BookingEntriesDialog>
              )}
            </div>
          </SheetHeader>

          {/* Lista de Pagamentos */}

          <div className="flex flex-col gap-2 border p-4 shadow-sm bg-slate-50">
            {booking && booking?.payments.length > 0 ? (
              booking?.payments.map(p => (
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
              ))
            ) : (
              <span className="text-sm font-bold text-slate-500">
                Nenhum pagamento registrado
              </span>
            )}
          </div>

          {/* Total */}
          <div className="rounded-br-2xl rounded-bl-2xl border bg-slate-50 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              Resumo Financeiro
            </h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>Total pago</span>
              </div>
              <span className="font-bold text-green-600">
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
              <span
                className={`font-bold ${(getValueTotalBooking(booking) || 0) < 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {formatCurrency(getValueTotalBooking(booking) || 0)}
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
