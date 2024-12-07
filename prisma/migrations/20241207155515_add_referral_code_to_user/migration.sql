-- DropIndex
DROP INDEX "User_referralCode_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "referralCode" DROP NOT NULL;
