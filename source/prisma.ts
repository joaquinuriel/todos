import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ??= new PrismaClient();
export default prisma

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
