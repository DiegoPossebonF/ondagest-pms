'use client'
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
import { BookingStatus } from '@prisma/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BookingStatusComboboxProps {
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  havePayments: boolean
}

export function BookingStatusCombobox({
  disabled,
  value,
  onChange,
  havePayments,
}: BookingStatusComboboxProps) {
  const [open, setOpen] = useState(false)

  const statusAvailable = Object.values(BookingStatus).filter(
    status =>
      status !== BookingStatus.CHECKED_IN &&
      status !== BookingStatus.CHECKED_OUT &&
      status !== BookingStatus.CANCELLED &&
      status !== BookingStatus.NO_SHOW
  )

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
            disabled={disabled}
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
              {statusAvailable.map(status => (
                <CommandItem
                  className="form-sm"
                  value={STATUS_LABELS[status]}
                  key={STATUS_LABELS[status]}
                  onSelect={() => {
                    onChange(status)
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
              {havePayments && (
                <p className="p-4 text-xs text-muted-foreground text-orange-400 text-center">
                  Não é possível cancelar ou marcar como no show pois existem
                  pagamentos lançados.
                </p>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
