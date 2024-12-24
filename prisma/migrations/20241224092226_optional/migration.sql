-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_locationDetailId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "locationDetailId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationDetailId_fkey" FOREIGN KEY ("locationDetailId") REFERENCES "LocationDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
