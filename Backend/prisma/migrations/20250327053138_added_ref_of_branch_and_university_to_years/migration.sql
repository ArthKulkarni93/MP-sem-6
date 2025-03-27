-- AlterTable
ALTER TABLE "YearTable" ADD COLUMN "branchId" INTEGER NOT NULL DEFAULT 1, 
ADD COLUMN "universityId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey for universityId
ALTER TABLE "YearTable" ADD CONSTRAINT "YearTable_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "UniversityTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey for branchId
ALTER TABLE "YearTable" ADD CONSTRAINT "YearTable_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "BranchTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
