import { getUserAndOrg } from '@/app/actions/utils/get-user-and-org'
import { OrganizationForm } from '@/components/organization/OrganizationForm'

export default async function OrganizationPage() {
  const user = await getUserAndOrg()
  const organization = user?.organization

  if (!organization)
    throw new Error(
      'Organização não localizada. Tente novamente mais tarde ou contate o suporte.'
    )

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Empresa</h1>
        <p className="text-muted-foreground">
          Aqui voce pode gerenciar os dados da sua empresa.
        </p>
      </div>
      <div className="flex flex-col p-6 items-center justify-center w-full">
        <OrganizationForm organization={organization} />
      </div>
    </>
  )
}
