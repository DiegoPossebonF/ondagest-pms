'use client'
import { searchGuestName } from '@/app/actions/guest/actions'
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
import { IconUserPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

interface GuestComboboxProps {
  selectedGuestName: string | null
  setSelectedGuestName: Dispatch<SetStateAction<string | null>>
  onChange: (value: string) => void
  disabled?: boolean
}

export function GuestCombobox({
  selectedGuestName,
  setSelectedGuestName,
  onChange,
  disabled,
}: GuestComboboxProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [guests, setGuests] = useState<Guest[] | null>([])

  useEffect(() => {
    if (!searchValue) {
      onChange('')
      setSelectedGuestName(null)
      setGuests([])
      return
    }
    const fetchGuests = async () => {
      const data = await searchGuestName(searchValue)
      setGuests(data)
    }
    fetchGuests()
  }, [searchValue, onChange, setSelectedGuestName])

  return (
    <div className="flex flex-row items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="combobox"
              className={cn(
                ' w-full justify-between bg-popover',
                !selectedGuestName && 'text-muted-foreground'
              )}
              size={'sm'}
              disabled={disabled}
            >
              {selectedGuestName ? selectedGuestName : 'Selecione o hóspede...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Procurar hóspede..."
              className="h-9"
              value={searchValue}
              onValueChange={value => {
                setSearchValue(value)
              }}
            />
            <CommandList>
              <CommandEmpty>
                {searchValue.length > 2 ? (
                  <>
                    <p>
                      Nenhum hóspede encontrado. Você pode criar um novo hóspede
                      clicando no botão abaixo.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Implementar a lógica para criar um novo hóspede
                        console.log('Criar novo hóspede')
                      }}
                    >
                      Criar novo hóspede
                    </Button>
                  </>
                ) : (
                  'Minimo 3 caracteres para buscar.'
                )}
              </CommandEmpty>
              <CommandGroup>
                {guests?.map(guest => (
                  <CommandItem
                    className="form-sm"
                    value={guest.name}
                    key={guest.id}
                    onSelect={() => {
                      onChange(guest.id)
                      setSelectedGuestName(guest.name)
                      setOpen(false)
                    }}
                  >
                    {guest.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        guest.name === selectedGuestName
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/** Button to create new guest */}
      {guests && guests.length < 1 && (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            router.push('/guests/new')
          }}
        >
          <IconUserPlus className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
