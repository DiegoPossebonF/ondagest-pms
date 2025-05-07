'use client'
import type { Payment, PaymentType } from '@/app/generated/prisma'
import { PAYMENT_TYPE_LABELS, cn, formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import dayjs, { type Dayjs } from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { BookingEntriesDialog } from './booking/BookingEntriesDialog '
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface ItemListProps {
  booking?: BookingAllIncludes
  date?: Dayjs
  type?: string
  paymentType?: PaymentType
  classname?: string
  amount: number
}

export function ItemList({
  booking,
  amount,
  date,
  type,
  paymentType,
  classname,
}: ItemListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [payment, setPayment] = useState<Payment>()

  const onEditPayment = (paymentEdit: Payment) => {
    setPayment(paymentEdit)
    setDialogOpen(true)
  }

  const onDeletePayment = () => {
    //setDialogOpen(true)
  }

  return (
    <>
      {booking && (
        <BookingEntriesDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          booking={booking}
          payment={payment}
        />
      )}
      <div
        className={cn(
          'flex justify-between min-w-[300px] items-center border rounded-lg px-3 shadow-sm',
          classname
          // ${payment?.id === p.id ? 'bg-orange-200' : 'bg-white'}
        )}
      >
        <div className="flex flex-row gap-4">
          <p className="font-semibold">{formatCurrency(amount)}</p>
          <div className="flex gap-1">
            <Badge className="font-mono text-[10px] text-blue-300">
              {dayjs(date).format('DD/MM/YYYY')}
            </Badge>
            <Badge
              className="font-mono text-[10px] text-blue-300"
              title={paymentType ? PAYMENT_TYPE_LABELS[paymentType] : type}
            >
              {paymentType ? PAYMENT_TYPE_LABELS[paymentType] : type}
            </Badge>
          </div>
        </div>
        <div className="flex items-center pl-2 w-12">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-1"
            onClick={onEditPayment}
          >
            <Pencil className="!w-3 !h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-1"
            onClick={onDeletePayment}
          >
            <Trash2 className="!w-3 !h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </>
  )
}
