/*
  Warnings:

  - You are about to drop the column `noofquestions` on the `TestTable` table. All the data in the column will be lost.
  - You are about to drop the column `noofstudents` on the `TestTable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `StudentTable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `TeacherTable` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalmarks` to the `TestTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestTable" DROP COLUMN "noofquestions",
DROP COLUMN "noofstudents",
ADD COLUMN     "totalmarks" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentTable_email_key" ON "StudentTable"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherTable_email_key" ON "TeacherTable"("email");

-- AddForeignKey
ALTER TABLE "ResultTable" ADD CONSTRAINT "ResultTable_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultTable" ADD CONSTRAINT "ResultTable_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
