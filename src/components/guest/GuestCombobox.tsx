'use client'

import { getGuests } from '@/actions/guest/getGuests'
import { getGuestsByName } from '@/actions/guest/getGuestsByName'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import { LoadingSpinner } from '../LoadingSpinner'
import type { BookingFormValues } from '../booking/BookingForm'
import { FormControl } from '../ui/form'

interface GuestComboboxProps {
  //booking?: BookingAllIncludes
  setValue: UseFormSetValue<BookingFormValues>
  guestId: string
  guestName?: string
}

export function GuestCombobox({
  setValue,
  guestId,
  guestName,
}: GuestComboboxProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [width, setWidth] = useState('auto')
  const [loadind, setLoading] = useState(false)
  const [openPopover, setOpenPopover] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [selectedGuestName, setSelectedGuestName] = useState(guestName || '')

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(`${triggerRef.current.offsetWidth}px`)
    }
  }, [])

  async function handleGetGuests(name: string) {
    try {
      setLoading(true)
      if (name) {
        const guests: Guest[] = await getGuestsByName(name)
        return guests
      }

      const guests: Guest[] = await getGuests()
      console.log(guests)
      return guests
    } catch {
      return [] as Guest[]
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  function handleSelect(guest: { id: string; name: string }) {
    setValue('guestId', guest.id)
    setSelectedGuestName(guest.name)
    setOpenPopover(false)
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="bookingform"
            ref={triggerRef}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn(
              'w-full justify-between',
              guestId && 'text-muted-foreground'
            )}
            onClick={async () => {
              const data = await handleGetGuests('')
              setGuests(data)
            }}
          >
            {selectedGuestName ? selectedGuestName : 'Selecione um hóspede...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent style={{ width }} className="p-0">
        <Command>
          <CommandInput
            placeholder="Procurar hóspede..."
            className="h-9"
            onValueChange={async value => {
              if (value) {
                const data = await handleGetGuests(value)
                setGuests(data)
              }
            }}
          />
          <CommandList>
            {loadind ? (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <CommandGroup>
                <CommandEmpty>Nenhum hóspede encontrado</CommandEmpty>
                {guests?.map(guest => (
                  <CommandItem
                    value={guest.name}
                    key={guest.id}
                    onSelect={() => handleSelect(guest)}
                  >
                    {guest.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        guest.id === guestId ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
