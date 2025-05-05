'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import type { Guest } from '@/app/generated/prisma'
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { GuestForm } from './GuestForm'

interface GuestSheetProps {
  guest?: Guest
  children: React.ReactNode
}

export function GuestSheet({ children, guest }: GuestSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {guest ? 'Editar' : 'Cadastrar'}
          </SheetTitle>
          <SheetDescription>
            {guest ? 'Edite os dados do hóspede' : 'Cadastre um novo hóspede'}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-4" />
        <GuestForm guest={guest} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
