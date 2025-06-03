'use client'

import { getUnits } from '@/app/(private)/(dashboard)/bookings/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BookingAllIncludes } from '@/types/booking'
import type { UnitWithTypeAndBookings } from '@/types/unit'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Command, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const filterSchema = z.object({
  guestQuery: z.string().optional(),
  unitId: z.string().optional(),
})

export default function BookingList() {
  const [bookings, setBookings] = useState<BookingAllIncludes[]>([])
  const [units, setUnits] = useState<UnitWithTypeAndBookings[]>([])
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)
  const take = 10 // Número de registros por "página"

  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      guestQuery: '',
      unitId: '',
    },
  })

  useEffect(() => {
    // Carrega as unidades para preencher o combobox
    const fetchUnits = async () => {
      const data = await getUnits()

      if (!data) {
        return
      }

      setUnits(data)
    }
    fetchUnits()
  }, [])

  const fetchBookings = async (filters = {}, append = false) => {
    setLoading(true)
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...filters, skip, take }),
    })
    const data = await response.json()

    setBookings(prev => (append ? [...prev, ...data] : data))
    setSkip(prev => prev + take)
    setLoading(false)
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(data => fetchBookings(data))}
          className="space-y-4"
        >
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="guestQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buscar hóspede</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome ou e-mail do hóspede" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acomodação</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {field.value
                            ? units.find(unit => unit.id === field.value)
                                ?.name || 'Selecione'
                            : 'Selecione'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar acomodação..." />
                          <CommandGroup>
                            {units.map(unit => (
                              <CommandItem
                                key={unit.id}
                                onSelect={() => field.onChange(unit.id)}
                              >
                                {unit.name} - {unit.type.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Filtrar'}
          </Button>
        </form>
      </Form>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableCell>Hóspede</TableCell>
            <TableCell>Acomodação</TableCell>
            <TableCell>Data de Início</TableCell>
            <TableCell>Data de Término</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Pagamento</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{booking.guest.name}</TableCell>
              <TableCell>{booking.unit.name}</TableCell>
              <TableCell>
                {dayjs(booking.startDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(booking.endDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.payments.length} - Fazer pagamento</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Button
          onClick={() => fetchBookings(form.getValues(), true)}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </Button>
      </div>
    </div>
  )
}
