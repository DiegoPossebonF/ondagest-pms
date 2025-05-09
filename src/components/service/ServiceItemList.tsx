'use client'
import type { Service } from '@/app/generated/prisma'
import { cn, formatCurrency } from '@/lib/utils'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'

interface ServiceItemListProps {
  service: Service
  classname?: string
  setOpenDialog?: Dispatch<SetStateAction<boolean>>
  setOpenDelete?: Dispatch<SetStateAction<boolean>>
  setService?: (service: Service) => void
}

export function ServiceItemList({
  service,
  classname,
  setOpenDialog,
  setService,
  setOpenDelete,
}: ServiceItemListProps) {
  const onEditPayment = (serviceEdit: Service) => {
    setService?.(serviceEdit)
    setOpenDialog?.(true)
  }

  const onDeletePayment = (serviceEdit: Service) => {
    setService?.(serviceEdit)
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
            {dayjs(service.createdAt).format('DD/MM/YYYY')}
          </div>
          <div className="text-xs font-mono">{service.name}</div>
          <div className="text-xs font-mono">
            {formatCurrency(service.amount)}
          </div>
        </div>
        <div className="flex items-center pl-2 w-12">
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setService ? '' : 'invisible'}`}
            onClick={() => onEditPayment(service)}
          >
            <Pencil className="!w-3 !h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`h-6 w-6 p-1 ${setService ? '' : 'invisible'}`}
            onClick={() => onDeletePayment(service)}
          >
            <Trash2 className="!w-3 !h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </>
  )
}
