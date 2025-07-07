'use client'
import type { UnitWithTypeAndBookings } from '@/app/(private)/(dashboard)/(admin)/settings/units/page'
import { createUnit } from '@/app/actions/unit/createUnit'
import { updateUnit } from '@/app/actions/unit/updateUnit'
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
import { type UnitSchema, unitSchema } from '@/schemas/unit-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoadingSpinner } from '../LoadingSpinner'
import { UnitTypesCombobox } from '../unit-type/UnitTypesCombobox'
import { UserFormError } from '../user/UserFormError'
import { UnitAlertDialogDelete } from './UnitAlertDialogDelete'

interface UnitFormProps {
  selectedUnit: UnitWithTypeAndBookings | null
  setSelectedUnit: (unitType: UnitWithTypeAndBookings | null) => void
  setOpenNewUnit: (open: boolean) => void
}

export default function UnitForm({
  selectedUnit,
  setSelectedUnit,
  setOpenNewUnit,
}: UnitFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<UnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: selectedUnit?.name ?? '',
      typeId: selectedUnit?.typeId ?? '',
    },
  })

  const onSubmit = (data: UnitSchema) => {
    if (selectedUnit) {
      startTransition(() => {
        updateUnit(selectedUnit.id, data).then(data => {
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
            form.reset()
            setServerError(null)
            setSelectedUnit(null)
            setOpenNewUnit(false)
          }
        })
      })
    } else {
      startTransition(() => {
        createUnit(data).then(data => {
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
            form.reset()
            setServerError(null)
            setSelectedUnit(null)
            setOpenNewUnit(false)
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
                  placeholder="Informe um nome para a acomodação"
                />
                <FormDescription className="sr-only">
                  Informe um nome para a acomodação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tipo de acomodação</FormLabel>
                <UnitTypesCombobox
                  unitTypeId={field.value}
                  onChange={(value: string) => field.onChange(value)}
                />
                <FormDescription className="sr-only">
                  Informe uma descrição para o tipo de acomodação
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
            {selectedUnit && (
              <UnitAlertDialogDelete
                unitId={selectedUnit.id}
                name={selectedUnit.name}
                setOpenNewUnit={setOpenNewUnit}
                setSelectedUnit={setSelectedUnit}
              />
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
