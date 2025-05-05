'use client'
import { createUnitType } from '@/actions/unit-type/createUnitType'
import { updateUnitType } from '@/actions/unit-type/updateUnitType'
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
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Separator } from '../ui/separator'
import { Textarea } from '../ui/textarea'

const unitSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'Quantidade de pessoas é obrigatória'),
})

export type UnitTypeFormValues = z.infer<typeof unitSchema>

interface UnitTypeFormProps {
  unitType?: UnitType
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function UnitTypeForm({ unitType, setOpen }: UnitTypeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<UnitTypeFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: unitType ? unitType.name : '',
      description: unitType ? unitType.description : '',
      numberOfPeople: unitType ? unitType.numberOfPeople : 0,
    },
  })

  async function onSubmitHandle(values: UnitTypeFormValues) {
    setLoading(true)

    console.log(values)

    try {
      if (unitType) {
        const data = await updateUnitType(values, unitType.id)

        if (!data.error) {
          toast({
            title: 'Sucesso',
            variant: 'success',
            description: 'Tipo de acomodação atualizado com sucesso',
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
        const data = await createUnitType(values)

        if (!data.error) {
          toast({
            title: 'Sucesso',
            variant: 'success',
            description: 'Tipo de acomodação criado com sucesso',
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
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro desconhecido, tente novamente mais tarde',
          variant: 'destructive',
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
                    placeholder="Informe o nome do tipo de acomodação"
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
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Nº de Pessoas</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Informe o numero de máximo de pessoas"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Role (Select usando shadcn/ui) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Faça uma breve descrição do tipo de acomodação"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
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
              ? unitType
                ? 'Salvando...'
                : 'Cadastrando...'
              : unitType
                ? 'Salvar'
                : 'Criar'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
