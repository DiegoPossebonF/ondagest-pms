'use client'
import type { User } from '@/app/generated/prisma'
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
import { UserForm } from './UserForm'

interface UserSheetProps {
  user?: User
  children: React.ReactNode
}

export function UserSheet({ user, children }: UserSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {user ? 'Editar' : 'Criar'}
          </SheetTitle>
          <SheetDescription>
            {user ? 'Edite os dados do usuário' : 'Crie um novo usuário'}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mb-4" />
        <UserForm user={user} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
