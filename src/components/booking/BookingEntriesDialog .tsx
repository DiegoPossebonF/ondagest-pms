'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { BookingAllIncludes } from '@/types/booking'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DiscountForm } from '../discount/DiscountForm'
import { PaymentForm } from '../payment/PaymentForm'
import { ServiceForm } from '../service/ServiceForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

type BookingEntriesDialogProps = {
  booking: BookingAllIncludes
}

export function BookingEntriesDialog({ booking }: BookingEntriesDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'}>
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{'Lançar pagamentos, Serviços e Descontos'}</DialogTitle>
          <DialogDescription>
            <Link href={`/booking/${booking?.id}`}>
              {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
            </Link>
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="service">Serviço</TabsTrigger>
            <TabsTrigger value="discount">Desconto</TabsTrigger>
          </TabsList>
          <TabsContent value="payment">
            <PaymentForm booking={booking} />
          </TabsContent>
          <TabsContent value="service">
            <ServiceForm booking={booking} setDialogOpen={setDialogOpen} />
          </TabsContent>
          <TabsContent value="discount">
            <DiscountForm booking={booking} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
