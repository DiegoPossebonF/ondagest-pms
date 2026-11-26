'use server'

import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'

// Models que possuem a coluna organizationId (fonte: prisma/schema.prisma)
const tenantModels = new Set(
  Prisma.dmmf.datamodel.models
    .filter(model => model.fields.some(field => field.name === 'organizationId'))
    .map(model => model.name)
)

// Operações de relação não escopadas automaticamente pelo tenant
const nestedWriteKeys = new Set([
  'create',
  'createMany',
  'connect',
  'connectOrCreate',
  'update',
  'upsert',
  'delete',
  'deleteMany',
  'disconnect',
  'set',
])

// biome-ignore lint/suspicious/noExplicitAny: <args variam por model/operação>
type QueryArgs = any

function assertTenantModel(model: string) {
  if (!tenantModels.has(model)) {
    throw new Error(
      `dbWithTenant não suporta o model "${model}" (sem organizationId). Use o client global com escopo explícito.`
    )
  }
}

function assertNoNestedWrites(value: unknown, path = 'data'): void {
  if (!value || typeof value !== 'object') return

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoNestedWrites(item, `${path}[${index}]`)
    )
    return
  }

  for (const [key, child] of Object.entries(value)) {
    if (nestedWriteKeys.has(key)) {
      throw new Error(
        `dbWithTenant não suporta escrita aninhada (${path}.${key}). Use operações separadas e valide as relações manualmente.`
      )
    }

    assertNoNestedWrites(child, `${path}.${key}`)
  }
}

export default async function dbWithTenant() {
  const session = await auth()
  if (!session?.user) return { db: null, error: 'Sessão inválida!' }
  if (!session.user.organizationId)
    return { db: null, error: 'Usuário sem organização!' }

  const organizationId = session.user.organizationId

  // Helpers → só aplicados em models com organizationId (validado antes)
  const withOrgInWhere = (args: QueryArgs) => ({
    ...args,
    where: {
      ...args.where,
      organizationId,
    },
  })

  const withOrgInData = (args: QueryArgs) => ({
    ...args,
    data: {
      ...args.data,
      organizationId,
    },
  })

  const withOrgInWhereAndData = (args: QueryArgs) => ({
    ...args,
    where: {
      ...args.where,
      organizationId,
    },
    data: {
      ...args.data,
      organizationId,
    },
  })

  const dbWithTenant = db.$extends({
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          assertTenantModel(model)

          // `query` é tipado pela união de todos os models/operações; o cast é
          // necessário porque os args são montados dinamicamente.
          const runQuery = query as unknown as (
            args: QueryArgs
          ) => ReturnType<typeof query>

          switch (operation) {
            // Leituras e deletes → filtro por organização
            case 'findMany':
            case 'findFirst':
            case 'findUnique':
            case 'findUniqueOrThrow':
            case 'findFirstOrThrow':
            case 'count':
            case 'aggregate':
            case 'groupBy':
            case 'delete':
            case 'deleteMany':
              return runQuery(withOrgInWhere(args))

            // Criação → injeta organização
            case 'create':
              assertNoNestedWrites(args.data)
              return runQuery(withOrgInData(args))

            case 'createMany':
            case 'createManyAndReturn': {
              const data = Array.isArray(args.data) ? args.data : [args.data]
              for (const item of data) {
                assertNoNestedWrites(item)
              }
              return runQuery({
                ...args,
                data: data.map(item => ({ ...item, organizationId })),
              })
            }

            // Atualização → filtra pela organização e não permite movê-la
            case 'update':
            case 'updateMany':
            case 'updateManyAndReturn':
              assertNoNestedWrites(args.data)
              return runQuery(withOrgInWhereAndData(args))

            case 'upsert':
              assertNoNestedWrites(args.create)
              assertNoNestedWrites(args.update)
              return runQuery({
                ...args,
                where: {
                  ...args.where,
                  organizationId,
                },
                create: {
                  ...args.create,
                  organizationId,
                },
                update: {
                  ...args.update,
                  organizationId,
                },
              })

            default:
              throw new Error(
                `dbWithTenant não suporta a operação "${operation}" no model "${model}".`
              )
          }
        },
      },
    },
  })

  return { db: dbWithTenant, error: null }
}
