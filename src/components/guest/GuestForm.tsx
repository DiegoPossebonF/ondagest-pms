'use client'

import { createGuest } from '@/app/actions/guest/createGuest'
import { updateGuest } from '@/app/actions/guest/updateGuest'
import { Button } from '@/components/ui/button'
import { type GuestSchema, guestSchema } from '@/schemas/guest-schema'
import { cpfMask, phoneMask } from '@/utils/masks'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Guest } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { GuestDeleteAlertDialog } from './GuestDeleteAlertDialog'
import { GuestFormError } from './GuestFormError'
import { useGuestsFilters } from './GuestsFiltersProvider'

interface GuestFormProps {
  guest?: Guest
}

export default function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const { refetch } = useGuestsFilters()
  const [serverError, setServerError] = useState<string | null>(null)

  const [isDisabled, setIsDisabled] = useState(!!guest || false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<GuestSchema>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name || '',
      email: guest?.email || '',
      phone: guest?.phone || '',
      cpf: guest?.cpf || '',
      city: guest?.city || '',
      carPlate: guest?.carPlate || '',
    },
  })

  async function onSubmit(values: GuestSchema) {
    if (guest) {
      startTransition(() => {
        updateGuest(guest.id, values).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setIsDisabled(true)
            setServerError(null)
            refetch()
            router.push(`/guests`)
          }
        })
      })
    } else {
      startTransition(() => {
        createGuest(values).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
            })
            form.reset()
            setServerError(null)
            refetch()
            router.push('/guests')
          }
        })
      })
    }
  }

  return (
    <>
      <GuestFormError
        errors={form.formState.errors}
        serverError={serverError}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome completo</FormLabel>
                <Input
                  {...field}
                  placeholder="Digite o nome completo"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe o nome completo do hóspede
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>CPF</FormLabel>
                <Input
                  {...field}
                  value={cpfMask(field.value)}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
                    field.onChange(raw)
                  }}
                  placeholder="000.000.000-00"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe o CPF do hóspede
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>E-mail</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="Digite o e-mail"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe o e-mail do hóspede
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Telefone</FormLabel>
                <Input
                  {...field}
                  value={phoneMask(field.value || '')}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
                    field.onChange(raw)
                  }}
                  placeholder="(00) 90000-0000"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe o telefone do hóspede
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cidade</FormLabel>
                <Input
                  {...field}
                  placeholder="Digite a cidade"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe a cidade do hóspede
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carPlate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Placa do carro</FormLabel>
                <Input
                  {...field}
                  placeholder="Digite a placa do carro"
                  disabled={isDisabled}
                />
                <FormDescription className="sr-only">
                  Informe a placa do carro do hóspede
                </FormDescription>
              </FormItem>
            )}
          />

          {guest ? (
            isDisabled ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDisabled(false)
                  }}
                  size={'sm'}
                >
                  Editar
                </Button>
                <GuestDeleteAlertDialog guestId={guest.id} />
              </div>
            ) : (
              <Button type="submit" className="w-full" size={'sm'}>
                {isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            )
          ) : (
            <Button type="submit" className="w-full" size={'sm'}>
              {isPending ? 'Criando...' : 'Novo hóspede'}
            </Button>
          )}
        </form>
      </Form>
    </>
  )
}
