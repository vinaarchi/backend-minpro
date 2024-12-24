-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EventCategory" ALTER COLUMN "format" SET DEFAULT 'Lainnya',
ALTER COLUMN "topic" SET DEFAULT 'Lainnya';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
