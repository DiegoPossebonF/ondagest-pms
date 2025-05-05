'use client'
import type { UnitType } from '@/app/generated/prisma'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Rate } from '@/types/rate'
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { RateForm } from './RateForm'

interface UserSheetProps {
  rate?: Rate
  unitTypes: UnitType[]
  children: React.ReactNode
}

export function RateSheet({ rate, unitTypes, children }: UserSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {rate ? 'Editar' : 'Criar'}
          </SheetTitle>
          <SheetDescription>
            {rate ? 'Edite os dados da tarifa' : 'Crie uma nova tarifa'}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-4" />
        <RateForm setOpen={setOpen} rate={rate} unitTypes={unitTypes} />
      </SheetContent>
    </Sheet>
  )
}
