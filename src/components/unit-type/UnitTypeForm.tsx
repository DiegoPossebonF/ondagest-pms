'use client'
import { createUnitType } from '@/app/actions/unitType/createUnitType'
import { updateUnitType } from '@/app/actions/unitType/updateUnitType'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type UnitTypeSchema, unitTypeSchema } from '@/schemas/unit-type-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UnitType } from '@prisma/client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoadingSpinner } from '../LoadingSpinner'
import { Textarea } from '../ui/textarea'
import { UserFormError } from '../user/UserFormError'
import { UnitTypeAlertDialogDelete } from './UnitTypeAlertDialogDelete'

interface UnitTypeFormProps {
  selectedUnitType: UnitType | null
  setSelectedUnitType: (unitType: UnitType | null) => void
  setOpenNewUnitType: (open: boolean) => void
}

export default function UnitTypeForm({
  selectedUnitType,
  setSelectedUnitType,
  setOpenNewUnitType,
}: UnitTypeFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<UnitTypeSchema>({
    resolver: zodResolver(unitTypeSchema),
    defaultValues: {
      name: selectedUnitType?.name ?? '',
      description: selectedUnitType?.description ?? '',
      numberOfPeople: selectedUnitType?.numberOfPeople ?? 1,
    },
  })

  const onSubmit = (data: UnitTypeSchema) => {
    if (selectedUnitType) {
      startTransition(() => {
        updateUnitType(selectedUnitType.id, data).then(data => {
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
            setServerError(null)
            form.reset()
            setOpenNewUnitType(false)
            setSelectedUnitType?.(null)
          }
        })
      })
    } else {
      startTransition(() => {
        createUnitType(data).then(data => {
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
            setServerError(null)
            form.reset()
            setOpenNewUnitType(false)
            setSelectedUnitType?.(null)
          }
        })
      })
    }
  }

  return (
    <>
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
                <FormLabel>Nome</FormLabel>
                <Input
                  {...field}
                  placeholder="Informe um nome para o tipo de acomodação"
                />
                <FormDescription className="sr-only">
                  Informe um nome para o tipo de acomodação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  {...field}
                  rows={4}
                  className="bg-popover"
                  placeholder="Informe uma descrição para o tipo de acomodação"
                />
                <FormDescription className="sr-only">
                  Informe uma descrição para o tipo de acomodação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nº de Pessoas</FormLabel>
                <Input
                  {...field}
                  placeholder="Informe o número de pessoas para o tipo de acomodação"
                />
                <FormDescription className="sr-only">
                  Informe o número de pessoas para o tipo de acomodação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <UserFormError
            errors={form.formState.errors}
            serverError={serverError}
          />

          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="w-full" size={'sm'}>
              {isPending ? <LoadingSpinner /> : 'Salvar'}
            </Button>
            {selectedUnitType && (
              <UnitTypeAlertDialogDelete
                unitTypeId={selectedUnitType.id}
                name={selectedUnitType.name}
                setOpenNewUnitType={setOpenNewUnitType}
                setSelectedUnitType={setSelectedUnitType}
              />
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
