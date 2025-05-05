'use client'
import { createUser } from '@/actions/user/createUserAction'
import { deleteUser } from '@/actions/user/deleteUser'
import { updateUser } from '@/actions/user/updateUser'
import type { User } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertCustom } from '../AlertCustom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Separator } from '../ui/separator'

const userSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().or(z.literal('')).optional(),
  role: z.enum(['ADMIN', 'USER']),
  avatar: z.any().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>

interface UserFormProps {
  user?: User
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function UserForm({ user, setOpen }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      password: user ? user.password : '',
      avatar: undefined,
      role: user ? user.role : 'USER',
    },
  })

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setAvatarPreview(URL.createObjectURL(selectedFile))
      form.setValue('avatar', e.target.files || undefined)
    }
  }

  async function onSubmitHandle(values: UserFormValues) {
    setLoading(true)

    try {
      if (values.avatar) {
        // Faz upload do arquivo para o Supabase Storage
        const formData = new FormData()
        formData.append('file', values.avatar[0])

        const responseUpload = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const resultUpload = await responseUpload.json()

        if (resultUpload.error) {
          throw new Error(resultUpload.error)
        }

        values.avatar = resultUpload.fileUrl
      }

      if (user) {
        const data = await updateUser(values, user.id)

        if (!data.error) {
          toast({
            title: 'Sucesso',
            description: 'Usuário atualizado com sucesso',
            variant: 'success',
          })
          router.refresh()
          setOpen(false)
        } else {
          toast({
            title: 'Erro',
            description: data.error,
            variant: 'destructive',
          })
        }
      } else {
        const data = await createUser(values)

        if (!data.error) {
          toast({
            title: 'Sucesso',
            description: 'Usuário criado com sucesso',
            variant: 'success',
          })
          router.refresh()
          setOpen(false)
        } else {
          toast({
            title: 'Erro',
            description: data.error,
            variant: 'destructive',
          })
        }
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
      setLoading(false)
    }
  }

  async function handleDeleteUser() {
    setLoading(true)

    try {
      const data = await deleteUser(user?.id || '')

      if (!data.error) {
        toast({
          title: 'Sucesso',
          description: 'Usuário deletado com sucesso',
          variant: 'success',
        })
        router.refresh()
        setOpen(false)
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
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandle)}
          className="space-y-4"
        >
          {/* Campo de Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Seu nome completo"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold">Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="********"
                    className="focus-visible:ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 border-blue-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Role (Select usando shadcn/ui) */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="font-semibold ">Função</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 border-2 border-blue-200">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Avatar */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      field.onChange(e.target.files)
                      onAvatarChange(e)
                    }}
                    className="focus-visible:ring-0 focus:ring-1 focus:ring-blue-500 focus:outline-none border-2 border-blue-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pré-visualização do Avatar */}

          <div className="flex justify-center">
            <Avatar className="w-40 h-40 border-2 border-blue-200 hover:border-blue-500">
              <AvatarImage
                src={avatarPreview || user?.image || ''}
                alt="User Avatar preview"
              />
              <AvatarFallback>
                <UserRound className="w-3/4 h-3/4" />
              </AvatarFallback>
            </Avatar>
          </div>

          <Separator className="my-4" />

          {/* Botão de Envio */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading
              ? user
                ? 'Salvando...'
                : 'Cadastrando...'
              : user
                ? 'Salvar'
                : 'Criar'}
          </Button>

          {/* Botão de deletar usuário */}
          {user && (
            // <Button
            //   className="w-full mt-4 bg-red-500 hover:bg-red-400"
            //   type="button"
            //   onClick={() => {
            //     handleDeleteUser()
            //     setOpen(false)
            //   }}
            // >
            //   Deletar
            // </Button>
            <AlertCustom
              title="Deletar usuário"
              textButton="Deletar"
              description="Tem certeza que deseja deletar o usuário?"
              textButtonCancel="Cancelar"
              textButtonAction="Deletar"
              action={() => {
                handleDeleteUser()
                setOpen(false)
              }}
            />
          )}
        </form>
      </Form>
    </div>
  )
}
