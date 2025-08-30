import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// (Optional) Hook for logging queries in dev
// prisma.$use(async (params, next) => {
//   console.log(`Prisma Query: ${params.model}.${params.action}`);
//   return next(params);
// });
