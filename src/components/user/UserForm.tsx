'use client'

import { createUser } from '@/app/actions/user/createUser'
import { updateUser } from '@/app/actions/user/updateUser'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ROLE_LABELS } from '@/lib/utils'
import { type UserSchema, userSchema } from '@/schemas/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoadingSpinner } from '../LoadingSpinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { UserAlertDialogDelete } from './UserAlertDialogDelete'
import { UserAvatarUpload } from './UserAvatarUpload'
import { UserFormError } from './UserFormError'
import { type UserData, useUsersFilters } from './UsersFiltersProvider'

export default function UserForm({
  selectedUser,
  setSelectedUser,
  setOpenNewUser,
}: {
  selectedUser?: UserData | null
  setSelectedUser?: (user: UserData | null) => void
  setOpenNewUser: (open: boolean) => void
}) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { refetch } = useUsersFilters()

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: selectedUser?.name ?? '',
      email: selectedUser?.email ?? '',
      password: '',
      role: selectedUser?.role ?? 'USER',
    },
  })

  const onSubmit = (data: UserSchema) => {
    if (selectedUser) {
      startTransition(() => {
        updateUser(selectedUser.id, data).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setServerError(null)
            form.reset()
            refetch()
            setOpenNewUser(false)
            setSelectedUser?.(null)
          }
        })
      })
    } else {
      startTransition(() => {
        createUser(data).then(data => {
          if (data.error) {
            setServerError(data.error)
            return
          }
          if (data.success) {
            toast('Sucesso', {
              description: data.success,
              duration: 5000,
              icon: '✅',
            })
            setServerError(null)
            form.reset()
            refetch()
            setOpenNewUser(false)
            setSelectedUser?.(null)
          }
        })
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="flex flex-row w-full justify-center">
            <UserAvatarUpload
              userId={selectedUser?.id ?? ''}
              initialImage={selectedUser?.image ?? ''}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome</FormLabel>
                <Input {...field} placeholder="Digite o nome completo" />
                <FormDescription className="sr-only">
                  Informe o nome completo do usuário
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>E-mail</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@exemplo.com.br"
                  onChange={e => {
                    field.onChange(e.target.value)
                    setServerError(null)
                  }}
                />
                <FormDescription className="sr-only">
                  Informe o nome completo do usuário
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Senha</FormLabel>
                <Input type="password" placeholder="******" {...field} />
                <FormMessage />
                <FormDescription className="text-xs text-center">
                  {selectedUser &&
                    'Informe uma senha para alterar ou deixe em branco para manter a mesma.'}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Função</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={'h-8 rounded-md px-3 text-xs bg-popover'}
                    >
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Role).map(role => (
                      <SelectItem key={role} value={role} className={'text-xs'}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="sr-only">
                  Informe a função do usuário
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <UserFormError
            errors={form.formState.errors}
            serverError={serverError}
          />

          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="w-full" size={'sm'}>
              {isPending ? <LoadingSpinner /> : 'Salvar'}
            </Button>
            {selectedUser && (
              <UserAlertDialogDelete
                userId={selectedUser.id}
                name={selectedUser.name ?? ''}
                role={selectedUser.role ?? ''}
                setOpenNewUser={setOpenNewUser}
                setSelectedUser={() => setSelectedUser?.(null)}
              />
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
