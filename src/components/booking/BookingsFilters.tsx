'use client'
import { BookingsFiltersForm } from '@/components/booking/BookingsFiltersForm'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import { IconFilterEdit, IconFilterX } from '@tabler/icons-react'
import { ButtonTooltip } from '../ButtonTooltip'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { useBookingFilters } from './BookingsFiltersProvider'

export default function BookingsFilters() {
  const isMobile = useIsMobile()
  const { filters, activeFilters, handleFilterChange, resetFilters } =
    useBookingFilters()

  if (isMobile)
    return (
      <div className="flex flex-row gap-2">
        {activeFilters && (
          <Button
            variant="destructive"
            size="icon"
            className="size-8 group-data-[collapsible=icon]:opacity-0"
            onClick={() => resetFilters()}
          >
            <IconFilterX className="w-4 h-4" />
          </Button>
        )}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
            >
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
              <BookingsFiltersForm
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
          icon={<IconFilterX className="w-4 h-4 text-red-500" />}
          className="self-start size-8 group-data-[collapsible=icon]:opacity-0"
          tooltipText="Limpar filtros"
          tooltipSide="top"
          onClick={() => resetFilters()}
        />
      )}
      <Popover>
        <ButtonTooltip
          className="self-start"
          tooltipText="Filtros"
          onClick={() => {}}
          tooltipSide="top"
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
            >
              <IconFilterEdit className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
        </ButtonTooltip>
        <PopoverContent className="z-50">
          <BookingsFiltersForm
            filters={filters}
            onChange={handleFilterChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
