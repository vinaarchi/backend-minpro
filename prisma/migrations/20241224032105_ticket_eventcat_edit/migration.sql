/*
  Warnings:

  - The `format` column on the `EventCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `topic` column on the `EventCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isPaid` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "EventCategory" DROP COLUMN "format",
ADD COLUMN     "format" TEXT NOT NULL DEFAULT 'LAINNYA',
DROP COLUMN "topic",
ADD COLUMN     "topic" TEXT NOT NULL DEFAULT 'LAINNYA';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "isPaid",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'paid';

-- DropEnum
DROP TYPE "Format";

-- DropEnum
DROP TYPE "TicketType";

-- DropEnum
DROP TYPE "Topic";
