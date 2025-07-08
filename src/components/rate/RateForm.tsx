'use client'
import type { RateWithUnitType } from '@/app/actions/rate/actions'
import { createRate } from '@/app/actions/rate/createRate'
import { updateRate } from '@/app/actions/rate/updateRate'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type RateSchema, rateSchema } from '@/schemas/rate-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CurrencyInput } from '../CurrencyInput'
import { FormError } from '../FormError'
import { LoadingSpinner } from '../LoadingSpinner'
import { UnitTypesCombobox } from '../unit-type/UnitTypesCombobox'
import { RateAlertDialogDelete } from './RateAlertDialogDelete'

interface RateFormProps {
  selectedRate: RateWithUnitType | null
  setSelectedRate: (rate: RateWithUnitType | null) => void
  setOpenNewRate: (open: boolean) => void
}

export default function RateForm({
  selectedRate,
  setSelectedRate,
  setOpenNewRate,
}: RateFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<RateSchema>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      name: selectedRate?.name ?? '',
      typeId: selectedRate?.typeId ?? '',
      value: selectedRate?.value ?? 0,
      numberOfPeople: selectedRate?.numberOfPeople ?? 1,
    },
  })

  const onSubmit = (data: RateSchema) => {
    if (selectedRate) {
      startTransition(() => {
        updateRate(selectedRate.id, data).then(data => {
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
            setSelectedRate(null)
            setOpenNewRate(false)
          }
        })
      })
    } else {
      startTransition(() => {
        createRate(data).then(data => {
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
            setSelectedRate(null)
            setOpenNewRate(false)
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
                <Input {...field} placeholder="Informe um nome para a Tarifa" />
                <FormDescription className="sr-only">
                  Informe um nome para a Tarifa
                </FormDescription>
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
                  Selecione um tipo de acomodação para a Tarifa
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valor da Tarifa</FormLabel>
                <CurrencyInput form={form} name="value" placeholder="R$ 0,00" />
                <FormDescription className="sr-only">
                  Informe o valor da Tarifa
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nº de Pessoas da Tarifa</FormLabel>
                <Input
                  type="number"
                  {...field}
                  placeholder="Informe o número de pessoas da Tarifa"
                  className={'h-8 rounded-md px-3 text-xs bg-popover'}
                />
                <FormDescription className="sr-only">
                  Informe o número de pessoas da Tarifa
                </FormDescription>
              </FormItem>
            )}
          />

          <FormError errors={form.formState.errors} serverError={serverError} />

          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="w-full" size={'sm'}>
              {isPending ? <LoadingSpinner /> : 'Salvar'}
            </Button>
            {selectedRate && (
              <RateAlertDialogDelete
                name={selectedRate.name}
                rateId={selectedRate.id}
                setOpenNewRate={setOpenNewRate}
                setSelectedRate={setSelectedRate}
              />
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
