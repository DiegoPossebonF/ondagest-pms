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
  const onEditService = (serviceEdit: Service) => {
    setService?.(serviceEdit)
    setOpenDialog?.(true)
  }

  const onDeleteService = (serviceEdit: Service) => {
    setService?.(serviceEdit)
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
                {dayjs(service.createdAt).format('DD/MM/YYYY')}
              </div>
              <div className="text-xs font-mono font-bold">
                {formatCurrency(service.amount)}
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {service.name}
            </div>
          </div>
          <div className="flex items-center pl-2 w-12">
            <Button
              size="icon"
              variant="ghost"
              className={`h-6 w-6 p-1 ${setService ? '' : 'invisible'}`}
              onClick={() => onEditService(service)}
            >
              <Pencil className="!w-3 !h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`h-6 w-6 p-1 ${setService ? '' : 'invisible'}`}
              onClick={() => onDeleteService(service)}
            >
              <Trash2 className="!w-3 !h-3 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
