/*
  Warnings:

  - Added the required column `duration` to the `TestTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestTable" ADD COLUMN     "duration" INTEGER NOT NULL;
