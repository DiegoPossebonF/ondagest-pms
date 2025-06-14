// app/components/UnitTable.jsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { deleteUnitType } from '@/actions/unit-type/deleteUnitType'
import type { Prisma, UnitType } from '@/app/generated/prisma'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCustom } from '../AlertCustom'
import { UnitTypeSheet } from './UnitTypeSheet'

type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: { type: true; bookings: true }
}>

interface UnitTableProps {
  unitTypes: UnitType[]
}

const UnitTypeTable = ({ unitTypes }: UnitTableProps) => {
  const router = useRouter()

  const deleteUnitTypeHandle = async (id: string) => {
    try {
      const res = await deleteUnitType(id)

      if (!res.error) {
        toast('Sucesso', {
          description: 'Tipo de acomodação deletada com sucesso!',
        })
      } else {
        toast('Erro', {
          description: res.error,
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        toast('Erro', {
          description: err.message,
        })
      } else {
        toast('Erro', {
          description: 'Erro não tratado - fale com o desenvolvedor',
        })
      }
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Nº de Pessoas</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unitTypes.map(unitType => (
            <TableRow key={unitType.id}>
              <TableCell>{unitType.name}</TableCell>
              <TableCell>{unitType.numberOfPeople}</TableCell>
              <TableCell>{unitType.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span> ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <UnitTypeSheet unitType={unitType}>
                      <Button className="w-full" variant={'ghost'}>
                        Editar
                      </Button>
                    </UnitTypeSheet>

                    <AlertCustom
                      textButton="Excluir"
                      title="Excluir Acomodação"
                      description="Tem certeza que deseja excluir essa acomodação?"
                      textButtonCancel="Cancelar"
                      textButtonAction="Excluir"
                      action={() => deleteUnitTypeHandle(unitType.id)}
                    >
                      <Button className="w-full" variant={'ghost'}>
                        Excluir
                      </Button>
                    </AlertCustom>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default UnitTypeTable
