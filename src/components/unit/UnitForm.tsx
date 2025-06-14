'use client'
import { createUnit } from '@/actions/unit/createUnit'
import { updateUnit } from '@/actions/unit/updateUnit'
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
import type { UnitWithTypeAndBookings } from '@/types/unit'
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

const unitSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.string().min(1, 'Tipo de unidade obrigatório'),
})

export type UnitFormValues = z.infer<typeof unitSchema>

interface UnitFormProps {
  unit?: UnitWithTypeAndBookings
  unitsType?: UnitType[]
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function UnitForm({ unit, unitsType, setOpen }: UnitFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: unit ? unit.name : '',
      type: unit ? unit.type.name : '',
    },
  })

  async function onSubmitHandle(values: UnitFormValues) {
    setLoading(true)

    try {
      values.type = unitsType?.find(type => type.name === values.type)?.id || ''

      if (unit) {
        const data = await updateUnit(values, unit.id)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Unidade atualizada com sucesso',
          })
          router.refresh()
          setOpen(false)
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      } else {
        const data = await createUnit(values)

        if (!data.error) {
          toast('Sucesso', {
            description: 'Unidade criada com sucesso',
          })
          router.refresh()
          setOpen(false)
        } else {
          toast('Erro', {
            description: data.error,
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast('Erro', {
          description: error.message,
        })
      } else {
        toast('Erro', {
          description: 'Erro desconhecido, tente novamente mais tarde',
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
                    placeholder="Informe um nome para a acomodação"
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
            name="type"
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
                      {unitsType?.map(unitType => (
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
              ? unit
                ? 'Salvando...'
                : 'Cadastrando...'
              : unit
                ? 'Salvar'
                : 'Criar'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
