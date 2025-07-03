'use client'
import { IconUsersPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ButtonTooltip } from '../ButtonTooltip'
import { StatusLegend } from '../StatusLegend'
import GuestsFilters from './GuestsFilters'
import { useGuestsFilters } from './GuestsFiltersProvider'

export default function GuestsListHeader() {
  const router = useRouter()
  const { activeFilters, resetFilters } = useGuestsFilters()

  return (
    <div className="flex flex-row justify-between gap-2">
      <ButtonTooltip
        icon={<IconUsersPlus className="w-4 h-4" />}
        tooltipText="Novo Hóspede"
        className="self-start"
        onClick={() => router.push('/guests/new')}
        tooltipSide="top"
      />
      <div className="flex flex-row gap-2">
        <GuestsFilters />
        <StatusLegend />
      </div>
    </div>
  )
}
