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

import { deleteRate } from '@/actions/rate/deleteRate'
import type { UnitType } from '@/app/generated/prisma'
import { toast } from '@/hooks/use-toast'
import type { Rate } from '@/types/rate'
import { useRouter } from 'next/navigation'
import { AlertCustom } from '../AlertCustom'
import { RateSheet } from './RateSheet'

interface UnitTableProps {
  rates: Rate[]
  unitTypes: UnitType[]
}

const RateTable = ({ rates, unitTypes }: UnitTableProps) => {
  const router = useRouter()

  const deleteRateHandle = async (id: string) => {
    try {
      const res = await deleteRate(id)

      if (!res.error) {
        toast({
          title: 'Sucesso',
          description: 'Tarifa deletada com sucesso!',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Erro',
          description: res.error,
          variant: 'destructive',
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Erro',
          description: err.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro não tratado - fale com o desenvolvedor',
          variant: 'destructive',
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
            <TableHead>Nome</TableHead>
            <TableHead>Nº Pessoas</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Tipo de acomodação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map(rate => (
            <TableRow key={rate.id}>
              <TableCell>{rate.name}</TableCell>
              <TableCell>{rate.numberOfPeople}</TableCell>
              <TableCell>{rate.value}</TableCell>
              <TableCell>{rate.type.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span> ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <RateSheet rate={rate} unitTypes={unitTypes}>
                      <Button className="w-full" variant={'ghost'}>
                        Editar
                      </Button>
                    </RateSheet>

                    <AlertCustom
                      textButton="Excluir"
                      title="Excluir Acomodação"
                      description="Tem certeza que deseja excluir essa acomodação?"
                      textButtonCancel="Cancelar"
                      textButtonAction="Excluir"
                      action={() => deleteRateHandle(rate.id)}
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

export default RateTable
