'use client'
import { IconUserPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ButtonTooltip } from '../ButtonTooltip'
import RatesFilters from './RatesFilters'

interface RatesListHeaderProps {
  setOpenNewRate: (open: boolean) => void
}

export default function RatesListHeader({
  setOpenNewRate,
}: RatesListHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-row justify-between gap-2">
      <ButtonTooltip
        icon={<IconUserPlus className="w-4 h-4" />}
        tooltipText="Nova tarifa"
        tooltipSide="top"
        className="self-start"
        onClick={() => setOpenNewRate(true)}
      />
      <div className="flex flex-row gap-2">
        <RatesFilters />
      </div>
    </div>
  )
}
