import type { Prisma } from '@prisma/client'

export type Rate = Prisma.RateGetPayload<{ include: { type: true } }>
