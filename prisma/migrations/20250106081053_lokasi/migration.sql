/*
  Warnings:

  - You are about to drop the column `country` on the `LocationDetail` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `LocationDetail` table. All the data in the column will be lost.
  - Added the required column `district` to the `LocationDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `LocationDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocationDetail" DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL;
