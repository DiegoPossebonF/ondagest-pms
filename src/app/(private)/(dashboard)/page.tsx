'use server'
import { getUnitsUpdatedBookingsByDate } from '@/app/actions/unit/actions'
import { getUserAndOrg } from '@/app/actions/utils/get-user-and-org'
import { StatusLegend } from '@/components/StatusLegend'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import UnitCard from '@/components/unit/UnitCard'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import Link from 'next/link'
import { redirect } from 'next/navigation'

dayjs.extend(isBetween)

export default async function Dashboard() {
  const user = await getUserAndOrg()

  if (!user?.organization?.isSetupCompleted) {
    redirect('/settings/organization')
  }

  const res = await getUnitsUpdatedBookingsByDate(dayjs().toDate())

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  if (res.data.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 overflow-auto">
        <Card className="w-5/6">
          <div className="p-6 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">
              Não há acomodações cadastradas!
            </h1>
            <Link href={'/settings/units'}>
              <Button variant={'secondary'} size={'sm'}>
                Cadastrar acomodações
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-auto flex flex-col gap-4">
      <div className="flex flex-row w-full justify-end items-end">
        <StatusLegend />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {res.data.map((unit, index) => {
          return <UnitCard key={unit.id} unit={unit} index={index} />
        })}
      </div>
    </div>
  )
}
