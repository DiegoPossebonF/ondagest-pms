'use client'
import { createGuest } from '@/actions/guest/createGuest'
import { deleteGuest } from '@/actions/guest/deleteGuest'
import { updateGuest } from '@/actions/guest/updateGuest'
import type { Guest } from '@/app/generated/prisma'
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
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertCustom } from '../AlertCustom'
import { Separator } from '../ui/separator'

// id         String      @id @default(uuid())
//   name       String
//   email      String      @unique
//   phone      String?

const guestSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^(\(?\d{2}\)?\s?)?(9?\d{4}-?\d{4})$/, {
    message:
      'Número de telefone inválido. Use o formato (99) 99999-9999 ou (99) 9999-9999',
  }),
})

export type GuestFormValues = z.infer<typeof guestSchema>

interface GuestFormProps {
  guest?: Guest
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function GuestForm({ guest, setOpen }: GuestFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name || '',
      email: guest?.email || '',
      phone: guest?.phone || '',
    },
  })

  const phone = form.watch('phone')

  const handleMaskPhoneHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    const previousValue = phone.replace(/\D/g, '') // Valor sem máscara atual

    if (value.length < phone.length) {
      // Backspace: permite apagar normalmente
      form.setValue('phone', value)
      return
    }

    value = value.replace(/\D/g, '') // Remove tudo que não for número

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3') // Formato (99) 99999-9999
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3') // Formato (99) 9999-9999
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2') // Formato (99) 9999
    }
    form.setValue('phone', value)
  }

  async function onSubmitHandle(values: GuestFormValues) {
    setLoading(true)

    try {
      if (guest) {
        const data = await updateGuest(values, guest.id)

        if (!data.error) {
          toast({
            title: 'Sucesso',
            variant: 'success',
            description: 'Hóspede atualizado com sucesso',
          })
          setOpen(false)
          router.refresh()
        } else {
          toast({
            title: 'Erro',
            description: data.error,
            variant: 'destructive',
          })
        }
      } else {
        const data = await createGuest(values)

        if (!data.error) {
          toast({
            variant: 'success',
            title: 'Sucesso',
            description: 'Hóspede criado com sucesso',
          })
          setOpen(false)
          router.refresh()
        } else {
          toast({
            title: 'Erro',
            description: data.error,
            variant: 'destructive',
          })
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Erro',
          description: err.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro não tratado - fale com o desenvolvedor',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteGuestHandle = async (id: string) => {
    try {
      const data = await deleteGuest(id)

      if (!data.error) {
        toast({
          title: 'Sucesso',
          variant: 'success',
          description: 'Hóspede excluido com sucesso',
        })
        setOpen(false)
        router.refresh()
      } else {
        toast({
          title: 'Erro',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Erro',
          description: err.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro não tratado - fale com o desenvolvedor',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandle)}
          className="space-y-4"
        >
          {/* Campo de Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Seu nome completo"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Seu e-mail" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Telefone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Seu telefone"
                    onChange={handleMaskPhoneHandle}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          {/* Botão de Envio */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading
              ? guest
                ? 'Salvando...'
                : 'Cadastrando...'
              : guest
                ? 'Salvar'
                : 'Criar'}
          </Button>

          {/* Botão de Excluir */}
          {guest && (
            <AlertCustom
              textButton="Excluir"
              title="Excluir Hóspede"
              description="Tem certeza que deseja excluir este hóspede?"
              textButtonCancel="Cancelar"
              textButtonAction="Excluir"
              action={() => deleteGuestHandle(guest.id)}
            >
              <Button className="w-full" variant={'destructive'}>
                Excluir
              </Button>
            </AlertCustom>
          )}
        </form>
      </Form>
    </div>
  )
}
