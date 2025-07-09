'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import { IconFilterEdit, IconFilterX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ButtonTooltip } from '../ButtonTooltip'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { RatesFiltersForm } from './RatesFiltersForm'
import { useRatesFilters } from './RatesFiltersProvider'

export default function RatesFilters() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { filters, activeFilters, handleFilterChange, resetFilters } =
    useRatesFilters()

  if (isMobile)
    return (
      <div className="flex flex-row gap-2">
        {activeFilters && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => resetFilters()}
          >
            <IconFilterX className="w-4 h-4" />
          </Button>
        )}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <IconFilterEdit className="w-4 h-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filtros</DrawerTitle>
              <DrawerDescription className="sr-only">
                Filtros da lista de tarifas
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <RatesFiltersForm
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    )

  return (
    <div className="flex flex-row gap-2">
      {activeFilters && (
        <ButtonTooltip
          icon={<IconFilterX className="w-4 h-4" />}
          tooltipText="Limpar filtros"
          tooltipSide="top"
          onClick={() => resetFilters()}
        />
      )}
      <Popover>
        <ButtonTooltip
          tooltipText="Filtros"
          tooltipSide="top"
          onClick={() => {}}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <IconFilterEdit className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
        </ButtonTooltip>

        <PopoverContent className="z-50">
          <RatesFiltersForm filters={filters} onChange={handleFilterChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
