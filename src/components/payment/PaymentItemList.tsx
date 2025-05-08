'use client'
import type { Payment } from '@/app/generated/prisma'
import { PAYMENT_TYPE_LABELS, cn, formatCurrency } from '@/lib/utils'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface PaymentItemListProps {
  payment: Payment
  classname?: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setOpenDeletePaymentDialog?: Dispatch<SetStateAction<boolean>>
  setPayment?: (payment: Payment) => void
}

export function PaymentItemList({
  payment,
  classname,
  setOpenDialog,
  setPayment,
  setOpenDeletePaymentDialog,
}: PaymentItemListProps) {
  const onEditPayment = (paymentEdit: Payment) => {
    setPayment?.(paymentEdit)
    setOpenDialog(true)
  }

  const onDeletePayment = (paymentEdit: Payment) => {
    setPayment?.(paymentEdit)
    setOpenDeletePaymentDialog?.(true)
  }

  return (
    <>
      <div
        className={cn(
          'flex justify-between min-w-[300px] items-center border rounded-lg px-2 py-1 shadow-sm',
          classname
          // ${payment?.id === p.id ? 'bg-orange-200' : 'bg-white'}
        )}
      >
        <div className="flex flex-row gap-4">
          <Badge
            className="font-mono text-[10px] text-blue-300"
            variant={'default'}
          >
            {formatCurrency(payment.amount)}
          </Badge>
          <Badge
            className="font-mono text-[10px] text-blue-300"
            variant={'secondary'}
          >
            {dayjs(payment.paidAt).format('DD/MM/YYYY')}
          </Badge>
          <Badge
            className="font-mono text-[10px] text-blue-300"
            title={PAYMENT_TYPE_LABELS[payment.paymentType]}
            variant={'secondary'}
          >
            {PAYMENT_TYPE_LABELS[payment.paymentType]}
          </Badge>
        </div>
        <div className="flex items-center pl-2 w-12">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-1"
            onClick={() => onEditPayment(payment)}
          >
            <Pencil className="!w-3 !h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-1"
            onClick={() => onDeletePayment(payment)}
          >
            <Trash2 className="!w-3 !h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </>
  )
}
