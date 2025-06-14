'use client'
import { createRate } from '@/actions/rate/createRate'
import { updateRate } from '@/actions/rate/updateRate'
import type { UnitType } from '@/app/generated/prisma'
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
import type { Rate } from '@/types/rate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Separator } from '../ui/separator'

const rateSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'O numero de pessoas deve ser maior que 0'),
  value: z.coerce
    .number({
      invalid_type_error: 'Por favor, insira um número válido.',
    })
    .min(1, 'O valor deve ser maior que 0'),
  unitType: z.string(),
})

export type RateFormValues = z.infer<typeof rateSchema>

interface RateFormProps {
  rate?: Rate
  unitTypes: UnitType[]
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function RateForm({ rate, unitTypes, setOpen }: RateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<RateFormValues>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      name: rate ? rate.name : '',
      numberOfPeople: rate?.numberOfPeople ? rate.numberOfPeople : 0,
      value: rate ? rate.value : 0,
      unitType: rate ? rate.type.name : '',
    },
  })

  async function onSubmitHandle(values: RateFormValues) {
    setLoading(true)

    try {
      values.unitType =
        unitTypes.find(type => type.name === values.unitType)?.id || ''
      if (rate) {
        const data = await updateRate(values, rate.id)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Tarifa atualizada com sucesso',
          })
          setOpen(false)
          router.refresh()
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      } else {
        const data = await createRate(values)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Tarifa criada com sucesso',
          })
          setOpen(false)
          router.refresh()
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast('Erro', {
          description: err.message,
        })
      } else {
        toast('Erro', {
          description: 'Erro não tratado - fale com o desenvolvedor',
        })
      }
    } finally {
      setLoading(false)
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

          {/* Campo de Número de Pessoas */}
          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">
                  Quantidade de pessoas
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Informe a quantidade de pessoas para o valor da tarifa"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Valor */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Valor da tarifa diária"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Role (Select usando shadcn/ui) */}
          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold ">
                  Tipo de Acomodação
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 border-2 border-blue-200">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes?.map(unitType => (
                        <SelectItem key={unitType.id} value={unitType.name}>
                          {unitType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          {/* Botão de Envio */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading
              ? rate
                ? 'Salvando...'
                : 'Cadastrando...'
              : rate
                ? 'Salvar'
                : 'Criar'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
