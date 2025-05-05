'use client'
import type { Guest } from '@/app/generated/prisma'
import { Card } from '@/components/ui/card'
import dayjs from 'dayjs'
import { CalendarIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { GuestSheet } from './GuestSheet'

interface GuestListProps {
  guests: Guest[]
}

export function GuestList({ guests }: GuestListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGuests = guests?.filter(
    guest =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <div>
          <Label className="text-base font-semibold py-2">Filtrar</Label>
          <Input
            type="text"
            placeholder="Filtrar por nome ou email..."
            className="mb-6 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredGuests.length > 0 ? (
          filteredGuests.map(guest => (
            //<Link key={guest.id} href={`/guest/${guest.id}`}>
            <GuestSheet key={guest.id} guest={guest}>
              <Card className="p-6 hover:bg-blue-200 hover:border-2 hover:border-blue-500 shadow-md cursor-pointer">
                <h2 className="text-xl font-semibold truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {guest.name}
                </h2>
                <div className="mt-2 text-gray-700 text-sm">
                  <div className="flex items-center space-x-2">
                    <MailIcon className="h-4 w-4 text-blue-500" />
                    <span>{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <PhoneIcon className="h-4 w-4 text-blue-500" />
                    <span>{guest.phone || 'Telefone não informado'}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                    <span>
                      Criado em: {dayjs(guest.createdAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                </div>
              </Card>
            </GuestSheet>
            //</Link>
          ))
        ) : (
          <p className="text-center col-span-full">
            Nenhum hóspede encontrado.
          </p>
        )}
      </div>
    </div>
  )
}
