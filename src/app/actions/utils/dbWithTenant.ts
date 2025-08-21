'use server'

import { auth } from '@/lib/auth'
import db from '@/lib/db'

export default async function dbWithTenant() {
  const session = await auth()
  if (!session?.user) return { db: null, error: 'Sessão inválida!' }
  console.log(session.user)
  if (!session.user.organizationId)
    return { db: null, error: 'Usuário sem organização!' }

  const organizationId = session.user.organizationId

  // Helper → só aplica se o modelo tiver organizationId no where/data
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addOrgToWhere = (args: any) => {
    return {
      ...args,
      where: {
        ...args.where,
        organizationId,
      },
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addOrgToCreate = (args: any) => {
    const data = {
      ...args.data,
      organizationId,
    }
    return {
      ...args,
      data,
    }
  }

  const dbWithTenant = db.$extends({
    query: {
      $allModels: {
        findMany({ args, query }) {
          return query(addOrgToWhere(args))
        },
        findFirst({ args, query }) {
          return query(addOrgToWhere(args))
        },
        findUnique({ args, query }) {
          return query(addOrgToWhere(args))
        },
        count({ args, query }) {
          return query(addOrgToWhere(args))
        },
        aggregate({ args, query }) {
          return query(addOrgToWhere(args))
        },
        groupBy({ args, query }) {
          return query(addOrgToWhere(args))
        },
        update({ args, query }) {
          return query(addOrgToWhere(args))
        },
        updateMany({ args, query }) {
          return query(addOrgToWhere(args))
        },
        delete({ args, query }) {
          return query(addOrgToWhere(args))
        },
        deleteMany({ args, query }) {
          return query(addOrgToWhere(args))
        },
        upsert({ args, query }) {
          return query({
            ...args,
            create: addOrgToCreate(args.create),
            update: addOrgToWhere(args.update),
          })
        },
        create({ args, query }) {
          return query(addOrgToCreate(args))
        },
        createMany({ args, query }) {
          if (Array.isArray(args.data)) {
            return query({
              ...args,
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              data: args.data.map((d: any) =>
                'organizationId' in d ? { ...d, organizationId } : d
              ),
            })
          }
          return query(addOrgToCreate(args))
        },
      },
    },
  })

  return { db: dbWithTenant, error: null }
}
