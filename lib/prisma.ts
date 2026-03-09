import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  
  // During build time, DATABASE_URL may not be available
  // Return a dummy client that will fail at runtime if actually used
  if (!connectionString) {
    // Return a proxy that throws helpful error when any method is called
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === 'then' || prop === 'catch') {
          return undefined
        }
        return () => {
          throw new Error('DATABASE_URL environment variable is not set. Please configure it in your Vercel project settings.')
        }
      }
    })
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
