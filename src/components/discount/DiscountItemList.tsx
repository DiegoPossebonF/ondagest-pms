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
          'flex justify-between items-center border rounded-2xl px-4 py-1 shadow-sm bg-blue-200 hover:bg-blue-100',
          classname
        )}
      >
        <div className="flex flex-row w-full">
          <div className="flex flex-col justify-between items-start w-full">
            <div className="flex gap-4">
              <div className="text-xs font-mono">
                {dayjs(discount.createdAt).format('DD/MM/YYYY')}
              </div>
              <div className="text-xs font-mono font-bold">
                {formatCurrency(discount.amount * -1)}
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {discount.reason}
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
      </div>
    </>
  )
}
