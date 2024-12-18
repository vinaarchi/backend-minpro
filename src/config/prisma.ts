import { PrismaClient } from "../../prisma/generated/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
