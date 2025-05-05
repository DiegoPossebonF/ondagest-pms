import { PrismaClient } from '@/app/generated/prisma'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const prisma = new PrismaClient()

const db = globalForPrisma.prisma || prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db
