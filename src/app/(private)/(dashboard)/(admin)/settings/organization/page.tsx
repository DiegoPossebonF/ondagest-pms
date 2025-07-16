import { getOrganization } from '@/app/actions/organization/actions'
import { OrganizationForm } from '@/components/organization/OrganizationForm'

export default async function OrganizationPage() {
  const res = await getOrganization()

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Organização</h1>
        <p className="text-muted-foreground">
          Aqui voce pode gerenciar os dados da sua organização (Empresa).
        </p>
      </div>
      <div className="flex flex-col p-6 items-center justify-center w-full">
        <OrganizationForm organization={res.data} />
      </div>
    </>
  )
}
