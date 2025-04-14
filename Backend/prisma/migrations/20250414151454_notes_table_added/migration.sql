-- CreateTable
CREATE TABLE "NotesTable" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "driveLink" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "NotesTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotesTable" ADD CONSTRAINT "NotesTable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesTable" ADD CONSTRAINT "NotesTable_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "UniversityTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesTable" ADD CONSTRAINT "NotesTable_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "BranchTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesTable" ADD CONSTRAINT "NotesTable_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "YearTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
