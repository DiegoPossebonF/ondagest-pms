'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { padNumber } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { Discount, Payment, Service } from '@prisma/client'
import {
  IconCashRegister,
  IconMoneybagMinus,
  IconTool,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { DiscountForm } from '../discount/DiscountForm'
import { PaymentForm } from '../payment/PaymentForm'
import { ServiceForm } from '../service/ServiceForm'
import { Card } from '../ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface BookingActionsSheetProps {
  openSheet: boolean
  setOpenSheet: (open: boolean) => void
  editAction?: 'payment' | 'discount' | 'service'
  editObject?: Payment | Discount | Service
  booking: BookingAllIncludes
}

export function BookingActionsSheet({
  openSheet,
  setOpenSheet,
  editAction,
  editObject,
  booking,
}: BookingActionsSheetProps) {
  const [action, setAction] = useState<'payment' | 'discount' | 'service'>(
    editAction || 'payment'
  )

  // atualizar a aba ao abrir o modal
  useEffect(() => {
    if (openSheet && editAction) {
      setAction(editAction)
    }
  }, [openSheet, editAction])

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                variant="default"
                title="Lançar pagamento"
                onClick={() => setAction('payment')}
              >
                <IconCashRegister className="h-4 w-4" />
                <span className="sr-only">Lançar pagamento</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lançar pagamento</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                variant="default"
                title="Adicionar Desconto"
                onClick={() => setAction('discount')}
              >
                <IconMoneybagMinus className="h-4 w-4" />
                <span className="sr-only">Adicionar Desconto</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adicionar Desconto</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                variant="default"
                title="Adicionar Serviço"
                onClick={() => setAction('service')}
              >
                <IconTool className="h-4 w-4" />
                <span className="sr-only">Adicionar Serviço</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adicionar Serviço</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <SheetContent side="right" className="sm:w-[400px] w-[80%] space-y-6">
        <SheetHeader>
          <SheetTitle>
            {action === 'payment'
              ? editObject
                ? 'Editar Pagamento'
                : 'Lançar Pagamento'
              : ''}
            {action === 'discount'
              ? editObject
                ? 'Editar Desconto'
                : 'Adicionar Desconto'
              : ''}
            {action === 'service'
              ? editObject
                ? 'Editar Serviço'
                : 'Adicionar Serviço'
              : ''}
          </SheetTitle>
          <SheetDescription>
            {action === 'payment'
              ? editObject
                ? 'Altere os dados abaixo para editar o pagamento desta reserva.'
                : 'Preencha os dados abaixo para lançar um novo pagamento nesta reserva.'
              : ''}

            {action === 'discount'
              ? editObject
                ? 'Altere os dados abaixo para editar o desconto desta reserva.'
                : 'Preencha os dados abaixo para registrar um novo desconto nesta reserva.'
              : ''}
            {action === 'service'
              ? editObject
                ? 'Altere os dados abaixo para editar o serviço desta reserva.'
                : 'Preencha os dados abaixo para registrar um novo serviço nesta reserva.'
              : ''}
          </SheetDescription>
        </SheetHeader>
        <Card className="p-4 text-sm">
          <div className="flex flex-row gap-2">
            <p className="font-semibold">Nº da reserva:</p>
            <p>{padNumber(booking.id, 5)}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-semibold">Acomodação:</p>
            <p>{booking.unit.name}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-semibold">Hóspede:</p>
            <p>{booking.guest.name}</p>
          </div>
        </Card>

        {action === 'payment' && (
          <PaymentForm
            booking={booking}
            payment={editObject as Payment}
            closeDialog={() => setOpenSheet(false)}
          />
        )}
        {action === 'discount' && (
          <DiscountForm
            bookingId={booking.id}
            discount={editObject as Discount}
            closeDialog={() => setOpenSheet(false)}
          />
        )}
        {action === 'service' && (
          <ServiceForm
            bookingId={booking.id}
            service={editObject as Service}
            closeDialog={() => setOpenSheet(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
