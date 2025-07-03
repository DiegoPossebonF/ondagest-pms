'use client'
import { IconUserPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ButtonTooltip } from '../ButtonTooltip'
import UsersFilters from './UsersFilters'

interface UsersListHeaderProps {
  setOpenNewUser: (open: boolean) => void
}

export default function UsersListHeader({
  setOpenNewUser,
}: UsersListHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-row justify-between gap-2">
      <ButtonTooltip
        icon={<IconUserPlus className="w-4 h-4" />}
        tooltipText="Novo usuário"
        tooltipSide="top"
        className="self-start"
        onClick={() => setOpenNewUser(true)}
      />
      <div className="flex flex-row gap-2">
        <UsersFilters />
      </div>
    </div>
  )
}
