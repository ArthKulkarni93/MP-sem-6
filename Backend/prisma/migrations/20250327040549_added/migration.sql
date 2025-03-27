-- AlterTable
ALTER TABLE "ResultTable" ADD COLUMN     "cheated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "StudentResponseTable" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "StudentResponseTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentResponseTable" ADD CONSTRAINT "StudentResponseTable_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentResponseTable" ADD CONSTRAINT "StudentResponseTable_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentResponseTable" ADD CONSTRAINT "StudentResponseTable_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionsTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
