import type { Prisma } from '@/app/generated/prisma'

export type Rate = Prisma.RateGetPayload<{ include: { type: true } }>
