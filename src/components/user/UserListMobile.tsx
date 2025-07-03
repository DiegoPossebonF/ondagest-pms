import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { type UserData, useUsersFilters } from './UsersFiltersProvider'

export function UserListMobile({
  setSelectedUser,
}: { setSelectedUser: (user: UserData | null) => void }) {
  const router = useRouter()
  const { users, SortHeader } = useUsersFilters()
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-sidebar dark:bg-background text-left">
          <TableRow>
            <TableHead className="flex flex-row items-center justify-between h-12 p-2">
              <SortHeader label="Nome" column="name" />
              <SortHeader label="Criado em" column="createdAt" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {users.map(user => (
            <TableRow key={user.id} className="border-0">
              <TableCell className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={user.id}
                    className="border-0 text-muted-foreground"
                  >
                    <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                      <div className="flex flex-row items-center justify-between w-full pr-4 pl-2 text-xs font-normal">
                        <span className="font-semibold">
                          {user.name || 'N/A'}
                        </span>
                        <span>
                          {dayjs(user.createdAt).format('DD/MM/YYYY') || 'N/A'}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t pb-0 text-xs">
                      <div className="flex flex-row overflow-hidden border-b">
                        <div className="min-w-[100px] flex flex-col border-r bg-sidebar dark:bg-background">
                          <p className="text-right border-b p-2 font-semibold">
                            E-mail
                          </p>
                          <p className="text-right border-b p-2 font-semibold">
                            Função
                          </p>
                        </div>
                        <div className="w-full flex flex-col">
                          <p className="text-right border-b p-2">
                            {user.email || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {user.role
                              ? user.role === 'ADMIN'
                                ? 'Administrador'
                                : 'Usuário'
                              : 'N/A'}
                          </p>
                          <div className="flex flex-row overflow-hidden">
                            <Button
                              className="w-full rounded-none"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                              }}
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
