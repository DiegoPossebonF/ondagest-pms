'use client'

import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type CurrencyInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  placeholder?: string
}

export function CurrencyInput<T extends FieldValues>({
  form,
  name,
  placeholder,
}: CurrencyInputProps<T>) {
  const { register, setValue, watch } = form
  const field = register(name)
  const value = watch(name)
  const [displayValue, setDisplayValue] = useState(() =>
    value ? formatCurrency(Number(value)) : ''
  )

  return (
    <Input
      {...field}
      value={displayValue}
      onChange={e => {
        const input = e.target.value
        // remove tudo que não é dígito ou vírgula, e troca vírgula por ponto
        const numeric = Number.parseFloat(
          input.replace(/[^\d,]/g, '').replace(',', '.')
        )
        setDisplayValue(input)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setValue(name, numeric as any, { shouldValidate: true })
      }}
      onBlur={() => {
        if (value) {
          const formatted = formatCurrency(Number(value))
          setDisplayValue(formatted)
        }
      }}
      placeholder={placeholder ?? '0,00'}
      className={'h-8 rounded-md px-3 text-xs bg-popover'}
    />
  )
}
