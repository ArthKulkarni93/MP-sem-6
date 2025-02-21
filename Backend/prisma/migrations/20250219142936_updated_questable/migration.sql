/*
  Warnings:

  - You are about to drop the column `marks` on the `QuestionsTable` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `QuestionsTable` table. All the data in the column will be lost.
  - Added the required column `maxMark` to the `QuestionsTable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queText` to the `QuestionsTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionsTable" DROP COLUMN "marks",
DROP COLUMN "question",
ADD COLUMN     "maxMark" INTEGER NOT NULL,
ADD COLUMN     "queText" TEXT NOT NULL;
