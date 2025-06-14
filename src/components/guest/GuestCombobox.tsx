'use client'
import { Check, ChevronsUpDown } from 'lucide-react'

import {
  getGuestsByName,
  getGuestsOrderUpdated,
} from '@/app/(private)/(dashboard)/bookings/new/actions'
import type { Guest } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface GuestComboboxProps {
  value: string
  onChange: (value: string) => void
}

export function GuestCombobox({ value, onChange }: GuestComboboxProps) {
  const [open, setOpen] = useState(false)
  const [guests, setGuests] = useState<Guest[] | null>([])
  const [guest, setGuest] = useState<Guest | null>(null)

  useEffect(() => {
    async function getGuests() {
      const dataGuests = await getGuestsOrderUpdated()
      setGuests(dataGuests)
    }
    getGuests()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn(
              'justify-between bg-popover',
              !value && 'text-muted-foreground'
            )}
            size={'sm'}
          >
            {guest ? guest.name : 'Selecione o hóspede...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Procurar hóspede..."
            className="h-9"
            onValueChange={async value => {
              if (!value || value.length <= 2) return
              const dataGuests = await getGuestsByName(value)
              setGuests(dataGuests)
            }}
          />
          <CommandList>
            <CommandEmpty>Nenhum hóspede encontrado</CommandEmpty>
            <CommandGroup>
              {guests?.map(guest => (
                <CommandItem
                  className="form-sm"
                  value={guest.name}
                  key={guest.id}
                  onSelect={() => {
                    onChange(guest.id)
                    setGuest(guest)
                    setOpen(false)
                  }}
                >
                  {guest.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      guest.id === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
