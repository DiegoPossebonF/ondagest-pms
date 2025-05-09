'use client'
import type { Payment } from '@/app/generated/prisma'
import {
  PAYMENT_TYPE_ICONS,
  PAYMENT_TYPE_LABELS,
  cn,
  formatCurrency,
} from '@/lib/utils'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'

interface PaymentItemListProps {
  payment: Payment
  classname?: string
  setOpenDialog?: Dispatch<SetStateAction<boolean>>
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
    setOpenDialog?.(true)
  }

  const onDeletePayment = (paymentEdit: Payment) => {
    setPayment?.(paymentEdit)
    setOpenDeletePaymentDialog?.(true)
  }

  const PaymentTypeIcon = PAYMENT_TYPE_ICONS[payment.paymentType]

  return (
    <>
      <div
        className={cn(
          'flex justify-between min-w-[300px] items-center border rounded-2xl px-4 py-1 shadow-sm bg-blue-200 hover:bg-blue-100',
          classname
        )}
      >
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="text-xs font-mono">
            {dayjs(payment.paidAt).format('DD/MM/YYYY')}
          </div>
          <div className="text-xs font-mono">
            {formatCurrency(payment.amount)}
          </div>
          <HoverCard>
            <HoverCardTrigger className="cursor-help">
              {<PaymentTypeIcon className="w-4 h-4" />}
            </HoverCardTrigger>
            <HoverCardContent align="center" className="bg-primary">
              <div className="flex flex-row justify-center items-center gap-4 text-blue-200">
                {<PaymentTypeIcon className="w-8 h-8 text-blue-200" />}
                {PAYMENT_TYPE_LABELS[payment.paymentType]}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex items-center pl-2 w-12">
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setPayment ? '' : 'invisible'}`}
            onClick={() => onEditPayment(payment)}
          >
            <Pencil className="!w-3 !h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setPayment ? '' : 'invisible'}`}
            onClick={() => onDeletePayment(payment)}
          >
            <Trash2 className="!w-3 !h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </>
  )
}
