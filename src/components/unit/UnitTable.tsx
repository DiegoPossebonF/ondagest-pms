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

import { deleteUnit } from '@/actions/unit/deleteUnit'
import type { Prisma, UnitType } from '@/app/generated/prisma'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCustom } from '../AlertCustom'
import { UnitSheet } from './UnitSheet'

type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: { type: true; bookings: true }
}>

interface UnitTableProps {
  units: UnitWithTypeAndBookings[]
  unitsType?: UnitType[]
}

const UnitTable = ({ units, unitsType }: UnitTableProps) => {
  const router = useRouter()

  const deleteUnitHandle = async (id: string) => {
    try {
      const data = await deleteUnit(id)

      if (!data.error) {
        toast('Sucesso', {
          description: 'Acomodação deletada com sucesso',
        })
      } else {
        toast('Erro', {
          description: data.error,
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
            <TableHead className="w-[150px]">Nome</TableHead>
            <TableHead>Tipo de UH</TableHead>
            <TableHead>Nº de Pessoas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map(unit => (
            <TableRow key={unit.id}>
              <TableCell>{unit.name}</TableCell>
              <TableCell>{unit.type.name}</TableCell>
              <TableCell>{unit.type.numberOfPeople}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span> ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <UnitSheet unit={unit} unitsType={unitsType}>
                      <Button className="w-full" variant={'ghost'}>
                        Editar
                      </Button>
                    </UnitSheet>

                    <AlertCustom
                      textButton="Excluir"
                      title="Excluir Acomodação"
                      description="Tem certeza que deseja excluir essa acomodação?"
                      textButtonCancel="Cancelar"
                      textButtonAction="Excluir"
                      action={() => deleteUnitHandle(unit.id)}
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

export default UnitTable
