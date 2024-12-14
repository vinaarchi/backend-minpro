/*
  Warnings:

  - Added the required column `locationDetailId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "locationDetailId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LocationDetail" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationDetailId_fkey" FOREIGN KEY ("locationDetailId") REFERENCES "LocationDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
