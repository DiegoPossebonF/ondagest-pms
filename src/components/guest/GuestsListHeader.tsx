'use client'
import { Button } from '@/components/ui/button'
import { IconCalendarPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { StatusLegend } from '../StatusLegend'
import GuestsFilters from './GuestsFilters'
import { useGuestsFilters } from './GuestsFiltersProvider'

export default function GuestsListHeader() {
  const router = useRouter()
  const { activeFilters, resetFilters } = useGuestsFilters()

  return (
    <div className="flex flex-row justify-between gap-2">
      <Button
        variant="outline"
        size="icon"
        className="self-start"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          router.push('/guests/new')
        }}
      >
        <IconCalendarPlus className="w-4 h-4" />
      </Button>
      <div className="flex flex-row gap-2">
        <GuestsFilters />
        <StatusLegend />
      </div>
    </div>
  )
}
