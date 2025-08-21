'use client'

import { createOrganization } from '@/app/actions/organization/createOrganization'
import { updateOrganization } from '@/app/actions/organization/updateOrganization'
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
import { Textarea } from '@/components/ui/textarea'
import {
  type OrganizationSchema,
  organizationSchema,
} from '@/schemas/organization-schema'
import { cepMask, cnpjMask, cpfMask, phoneMask } from '@/utils/masks'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Organization } from '@prisma/client'
import { useRouter } from 'next/navigation'
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
import { OrganizationLogoUpload } from './OrganizationLogoUpload'

interface OrganizationFormProps {
  organization?: Organization
  closeDialog?: () => void
}

export function OrganizationForm({
  organization,
  closeDialog,
}: OrganizationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || '',
      email: organization?.email || '',
      phone: organization?.phone || '',
      website: organization?.website || '',
      facebook: organization?.facebook || '',
      instagram: organization?.instagram || '',
      address: organization?.address || '',
      city: organization?.city || '',
      state: organization?.state || '',
      zipCode: organization?.zipCode || '',
      country: organization?.country || '',
      cpf: organization?.cpf || '',
      cnpj: organization?.cnpj || '',
      rules: organization?.rules || '',
      sharingMessageVoucher: organization?.sharingMessageVoucher || '',
      sharingMessageReceipt: organization?.sharingMessageReceipt || '',
      isLegalEntity: !organization?.cpf,
    },
  })

  async function onSubmitHandle(values: OrganizationSchema) {
    startTransition(async () => {
      if (organization) {
        const data = await updateOrganization(organization.id, values)
        if (data.error) {
          setServerError(data.error)
          return
        }
        if (data.success) {
          toast('Sucesso', { description: data.success, icon: '✅' })
          setServerError(null)
          closeDialog?.()
          if (!organization.isSetupCompleted) {
            router.push('/')
          } else {
            router.refresh()
          }
        }
      } else {
        const data = await createOrganization(values)

        if (data.error) {
          setServerError(data.error)
          return
        }

        if (data.success) {
          toast('Sucesso', { description: data.success, icon: '✅' })
          setServerError(null)
          closeDialog?.()
          router.push('/')
        }
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-4xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandle)}
          className="space-y-4"
        >
          <div className="flex flex-col items-center">
            {organization && (
              <FormField
                name="logo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">Logo</FormLabel>
                    <FormControl>
                      <OrganizationLogoUpload
                        initialImage={organization?.logoUrl || undefined}
                        organizationId={organization?.id || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Nome da empresa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nome"
                    className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="email@empresa.com"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={phoneMask(field.value ?? '')}
                      onChange={e => field.onChange(phoneMask(e.target.value))}
                      placeholder="(99) 99999-9999"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              name="website"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://..."
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="facebook"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://facebook.com/..."
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="instagram"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://instagram.com/..."
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Rua, número, bairro..."
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Cidade"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="state"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Estado"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="zipCode"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={cepMask(field.value ?? '')}
                      onChange={e => field.onChange(cepMask(e.target.value))}
                      placeholder="00000-000"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Brasil"
                      className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isLegalEntity"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Pessoa Física/Jurídica</FormLabel>
                  <Select
                    value={field.value ? 'juridica' : 'fisica'}
                    onValueChange={(value: string) => {
                      field.onChange(value === 'juridica')
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 rounded-md px-3 text-xs bg-popover">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('isLegalEntity') ? (
              <FormField
                name="cnpj"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={cnpjMask(field.value ?? '')}
                        onChange={e => field.onChange(cnpjMask(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        className="h-8 rounded-md px-3 text-xs bg-popover"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                name="cpf"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={cpfMask(field.value ?? '')}
                        onChange={e => field.onChange(cpfMask(e.target.value))}
                        placeholder="000.000.000-00"
                        className="h-8 rounded-md px-3 text-xs bg-popover"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            name="rules"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Regras</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Regras do local"
                    className="h-8 rounded-md px-3 text-xs md:text-xs bg-popover"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="sharingMessageVoucher"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Voucher - Mensagem de compartilhamento</FormLabel>
                <FormMessage />
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Mensagem personalizada para voucher"
                    className="rounded-md px-3 text-xs md:text-xs bg-popover resize-y"
                  />
                </FormControl>
                <FormDescription>
                  Obrigatório conter uma tag [LINK] na mensagem, que será
                  substituida pelo link do voucher.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="sharingMessageReceipt"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Recibo - Mensagem de compartilhamento</FormLabel>
                <FormMessage />
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Mensagem personalizada para recibo"
                    className="rounded-md px-3 text-xs md:text-xs bg-popover resize-y"
                  />
                </FormControl>
                <FormDescription>
                  Obrigatório conter uma tag [LINK] na mensagem, que será
                  substituida pelo link do recibo.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="mt-2 w-full"
            >
              {isPending ? (
                <LoadingSpinner />
              ) : organization ? (
                'Salvar alterações'
              ) : (
                'Cadastrar empresa'
              )}
            </Button>
            {serverError && (
              <div className="text-sm text-red-500">{serverError}</div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
