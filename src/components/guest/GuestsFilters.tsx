'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import { IconFilterEdit, IconFilterX } from '@tabler/icons-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { GuestsFiltersForm } from './GuestsFiltersForm'
import { useGuestsFilters } from './GuestsFiltersProvider'

export default function GuestsFilters() {
  const isMobile = useIsMobile()
  const { filters, activeFilters, handleFilterChange, resetFilters } =
    useGuestsFilters()

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
                Filtros da lista de reservas
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <GuestsFiltersForm
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
        <Button
          variant="destructive"
          size="icon"
          onClick={() => resetFilters()}
        >
          <IconFilterX className="w-4 h-4" />
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <IconFilterEdit className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50">
          <GuestsFiltersForm filters={filters} onChange={handleFilterChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
