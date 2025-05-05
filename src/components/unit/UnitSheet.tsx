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
import type { UnitWithTypeAndBookings } from '@/types/unit'
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { UnitForm } from './UnitForm'

interface UnitSheetProps {
  unit?: UnitWithTypeAndBookings
  unitsType?: UnitType[]
  children: React.ReactNode
}

export function UnitSheet({ unit, unitsType, children }: UnitSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {unit ? 'Editar' : 'Criar'}
          </SheetTitle>
          <SheetDescription>
            {unit ? 'Edite os dados da acmodação' : 'Crie uma nova acomodação'}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-4" />
        <UnitForm unit={unit} unitsType={unitsType} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
