import { PrismaClient } from "@prisma/client";

let prisma;

if (
  process.env.APP_ENVIRONMENT === "production" ||
  process.env.APP_ENVIRONMENT === "staging"
) {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global;
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export { prisma };
