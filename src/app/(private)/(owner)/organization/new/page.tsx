import { OrganizationForm } from '@/components/organization/OrganizationForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewOrganizationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Nova Empresa
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm mt-2">
            Para ter acesso a todas as funcionalidades da plataforma, você
            precisa cadastrar uma empresa. Preencha os dados abaixo para
            começar.
          </p>
        </CardHeader>

        <CardContent>
          {/* Aqui entra o formulário real */}
          <div className="flex flex-col items-center justify-center">
            <OrganizationForm />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
