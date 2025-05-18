import { PrismaClient } from "@prisma/client"

// Create a single instance of Prisma Client
declare global {
  var cachedPrisma: PrismaClient
}

export let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}
