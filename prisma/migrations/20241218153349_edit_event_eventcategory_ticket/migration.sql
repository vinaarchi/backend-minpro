/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `EventCategory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `EventCategory` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `contactEmail` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiredDate` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaid` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Format" AS ENUM ('FESTIVAL', 'KONSER', 'PERTANDINGAN', 'EXHIBITION', 'KONFERENSI', 'WORKSHOP', 'PERTUNJUKAN', 'ATRAKSI', 'THEME_PARK', 'AKOMODASI', 'SEMINAR', 'SOCIAL_GATHERING', 'TRAINING', 'SCHOOL_EVENT', 'TRIP', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('ANAK_KELUARGA', 'BISNIS', 'DESAIN', 'FASHION_BEAUTY', 'FILM', 'GAME', 'HOBI', 'INVESTASI', 'KARIR', 'KEAGAMAAN', 'KESEHATAN', 'KEUANGAN', 'LINGKUNGAN', 'MAKANAN_MINUMAN', 'MARKETING', 'MUSIK', 'OLAHRAGA', 'OTOMOTIF', 'SAINS_TEKNOLOGI', 'SENI_BUDAYA', 'SOSHUMPOL', 'STANDUP_KOMEDI', 'PENDIDIKAN', 'TECH_STARTUP', 'WISATA', 'LAINNYA');

-- DropIndex
DROP INDEX "EventCategory_name_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "availableSeats",
DROP COLUMN "price",
ADD COLUMN     "heldBy" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "EventCategory" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "format" "Format" NOT NULL DEFAULT 'LAINNYA',
ADD COLUMN     "topic" "Topic" NOT NULL DEFAULT 'LAINNYA';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "ticketType",
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "expiredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ticketName" TEXT NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
