'use client'
import { getServices } from '@/app/(private)/(dashboard)/actions'
import { createService } from '@/app/actions/service/createService'
import type { Service } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn, formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const ServiceSchema = z.object({
  bookingId: z.number().min(1, { message: 'Reserva não informada!' }),
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  amount: z.string().min(1, 'Valor é obrigatório'),
})

export type ServiceFormValues = z.infer<typeof ServiceSchema>

interface ServiceFormProps {
  booking: BookingAllIncludes
  service?: Service
}

export function ServiceForm({ booking, service }: ServiceFormProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [width, setWidth] = useState('auto')
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [openPopover, setOpenPopover] = useState(false)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      bookingId: service?.bookingId || booking.id,
      name: service?.name || '',
      amount: service ? formatCurrency(service.amount) : '',
    },
  })

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(`${triggerRef.current.offsetWidth}px`)
    }
  }, [])

  useEffect(() => {
    const getInitialServices = async () => {
      setServices(await getServices())
    }

    form.reset({
      bookingId: service?.bookingId || booking.id,
      name: service?.name || '',
      amount: service ? formatCurrency(service.amount) : '',
    })

    getInitialServices()
  }, [service, form, booking.id])

  async function onSubmitHandle(values: ServiceFormValues) {
    console.log(values)
    const data = await createService({
      ...values,
      amount: Number(values.amount),
    })

    console.log(data)
  }

  const setServicesHandler = async (input: string) => {
    form.setValue('name', input)

    setFilteredServices(
      services.filter(service =>
        service.name.toLowerCase().includes(input.toLowerCase())
      ) || []
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandle)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Serviço</FormLabel>
                <Popover
                  open={openPopover}
                  onOpenChange={setOpenPopover}
                  modal={openPopover}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        ref={triggerRef}
                        // biome-ignore lint/a11y/useSemanticElements: <explanation>
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? services.find(
                              service => service.name === field.value
                            )?.name || field.value
                          : 'Selecione o serviço'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" style={{ width }}>
                    <Command>
                      <CommandInput
                        placeholder="Procure o serviço..."
                        className="h-9"
                        onValueChange={setServicesHandler}
                      />
                      <CommandList>
                        <CommandEmpty>Serviço não encontrado</CommandEmpty>
                        <CommandGroup>
                          {filteredServices.map(service => (
                            <CommandItem
                              className="cursor-pointer"
                              value={service.name}
                              key={service.id}
                              onSelect={() => {
                                form.setValue('name', service.name)
                                setOpenPopover(false)
                              }}
                            >
                              {service.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  service.name === field.value
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de valor */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={e => {
                      const rawValue = e.target.value
                      const onlyDigits = rawValue.replace(/\D/g, '')
                      const numberValue = Number(onlyDigits) / 100
                      const formatted = numberValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                      field.onChange(formatted)
                    }}
                    value={field.value}
                    placeholder="Valor do serviço"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? service
                ? 'Salvando...'
                : 'Lançando...'
              : service
                ? 'Salvar alterações'
                : 'Lançar serviço'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
