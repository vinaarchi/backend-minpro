/*
  Warnings:

  - You are about to drop the column `expiration` on the `DiscountCoupon` table. All the data in the column will be lost.
  - Added the required column `expirationDate` to the `DiscountCoupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountCoupon" DROP COLUMN "expiration",
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL;
