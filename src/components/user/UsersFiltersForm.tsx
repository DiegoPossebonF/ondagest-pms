'use client'
import { Input } from '@/components/ui/input'
import { ROLE_LABELS } from '@/lib/utils'
import { Role } from '@prisma/client'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { Filters } from './UsersFiltersProvider'

export function UsersFiltersForm({
  filters,
  onChange,
}: {
  filters: Filters
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onChange: (key: keyof Filters, value: any) => void
}) {
  const handleRoleChange = (role: string) => {
    const roles = filters.role.includes(role as Role)
      ? filters.role.filter(r => r !== role)
      : [...filters.role, role]
    onChange('role', roles)
  }

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-3 pb-4 z-50">
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          name="name"
          placeholder="Buscar nome"
          value={filters.name}
          onChange={e => onChange('name', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          placeholder="Buscar e-mail"
          value={filters.email}
          onChange={e => onChange('email', e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full space-y-2">
        <Label>Função</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="combobox"
              size="sm"
              className="justify-between px-3 text-xs bg-popover"
            >
              {filters.role.length > 0
                ? `${filters.role.length} selecionado(s)`
                : 'Todos'}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {Object.entries(Role).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
                >
                  <Checkbox
                    id={`status-${key}`}
                    checked={filters.role.includes(key as Role)}
                    onCheckedChange={() => handleRoleChange(key)}
                  />
                  <label
                    htmlFor={`status-${key}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed"
                  >
                    {ROLE_LABELS[label]}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
