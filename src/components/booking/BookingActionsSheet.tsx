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
import {
  IconCashRegister,
  IconMoneybagMinus,
  IconTool,
} from '@tabler/icons-react'
import { useState } from 'react'
import { PaymentForm } from '../payment/PaymentForm'
import { Card } from '../ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function BookingActionsSheet({
  booking,
}: { booking: BookingAllIncludes }) {
  const [action, setAction] = useState<'payment' | 'discount' | 'service'>(
    'payment'
  )

  return (
    <Sheet>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                variant="outline"
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
                variant="outline"
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
                variant="outline"
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

      <SheetContent side="right" className="sm:w-[400px] w-[90%] space-y-6">
        <SheetHeader>
          <SheetTitle>
            {action === 'payment' && 'Lançar pagamento'}
            {action === 'discount' && 'Adicionar Desconto'}
            {action === 'service' && 'Adicionar Serviço'}
          </SheetTitle>
          <SheetDescription>
            {action === 'payment' &&
              'Preencha os dados abaixo para lançar um novo pagamento nesta reserva.'}
            {action === 'discount' &&
              'Preencha os dados abaixo para registrar um novo desconto nesta reserva.'}
            {action === 'service' &&
              'Preencha os dados abaixo para registrar um novo serviço nesta reserva.'}
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

        {action === 'payment' && <PaymentForm bookingId={booking.id} />}
        {action === 'discount' && '<DiscountForm bookingId={bookingId} />'}
        {action === 'service' && '<ServiceForm bookingId={bookingId} />'}
      </SheetContent>
    </Sheet>
  )
}
