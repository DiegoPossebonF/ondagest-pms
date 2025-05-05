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
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { UnitTypeForm } from './UnitTypeForm'

interface UnitSheetProps {
  unitType?: UnitType
  children: React.ReactNode
}

export function UnitTypeSheet({ unitType, children }: UnitSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {unitType ? 'Editar' : 'Criar'}
          </SheetTitle>
          <SheetDescription>
            {unitType
              ? 'Edite os dados da acmodação'
              : 'Crie uma nova acomodação'}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-4" />
        <UnitTypeForm setOpen={setOpen} unitType={unitType} />
      </SheetContent>
    </Sheet>
  )
}
