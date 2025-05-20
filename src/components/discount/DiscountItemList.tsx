'use client'
import type { Discount } from '@/app/generated/prisma'
import { cn, formatCurrency } from '@/lib/utils'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'

interface DiscountItemListProps {
  discount: Discount
  classname?: string
  setOpenDialog?: Dispatch<SetStateAction<boolean>>
  setOpenDelete?: Dispatch<SetStateAction<boolean>>
  setDiscount?: (discount: Discount) => void
}

export function DiscountItemList({
  discount,
  classname,
  setOpenDialog,
  setDiscount,
  setOpenDelete,
}: DiscountItemListProps) {
  const onEditDiscount = (discount: Discount) => {
    setDiscount?.(discount)
    setOpenDialog?.(true)
  }

  const onDeleteDiscount = (discount: Discount) => {
    setDiscount?.(discount)
    setOpenDelete?.(true)
  }

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
            {dayjs(discount.createdAt).format('DD/MM/YYYY')}
          </div>
          <div className="text-xs font-mono">{discount.reason}</div>
          <div className="text-xs font-mono">
            {formatCurrency(discount.amount)}
          </div>
        </div>
        <div className="flex items-center pl-2 w-12">
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setDiscount ? '' : 'invisible'}`}
            onClick={() => onEditDiscount(discount)}
          >
            <Pencil className="!w-3 !h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setDiscount ? '' : 'invisible'}`}
            onClick={() => onDeleteDiscount(discount)}
          >
            <Trash2 className="!w-3 !h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </>
  )
}
