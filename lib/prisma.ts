import { PrismaClient } from '@prisma/client'

// PrismaClient 인스턴스를 글로벌 객체에 할당하여 핫 리로드시에도 새로운 인스턴스가 생성되지 않도록 합니다.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 