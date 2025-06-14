'use client'
import { BookingStatus } from '@/app/generated/prisma'
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
import { STATUS_LABELS, cn } from '@/lib/utils'
import type { BookingSchema } from '@/schemas/booking-schema'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

interface BookingStatusComboboxProps {
  value: string
  setValue: UseFormSetValue<BookingSchema>
}

export function BookingStatusCombobox({
  value,
  setValue,
}: BookingStatusComboboxProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      // Retira o foco do elemento automaticamente focado
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="combobox"
            className={cn('justify-between bg-popover', !value && '')}
            size={'sm'}
          >
            {value
              ? STATUS_LABELS[value as BookingStatus]
              : 'Selecione o status da reserva'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Procurar status..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum status encontrado</CommandEmpty>
            <CommandGroup>
              {Object.values(BookingStatus).map(status => (
                <CommandItem
                  className="form-sm"
                  value={STATUS_LABELS[status]}
                  key={STATUS_LABELS[status]}
                  onSelect={() => {
                    setValue('status', status)
                    setOpen(false)
                  }}
                >
                  {STATUS_LABELS[status]}
                  <Check
                    className={cn(
                      'ml-auto',
                      status === value ? 'opacity-100' : 'opacity-0'
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
