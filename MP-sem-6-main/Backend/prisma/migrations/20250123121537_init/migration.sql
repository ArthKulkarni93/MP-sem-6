-- CreateTable
CREATE TABLE "UniversityTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "UniversityTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchTable" (
    "id" SERIAL NOT NULL,
    "Branchcode" TEXT NOT NULL,
    "Branchname" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "BranchTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "YearTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTable" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "PRN" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "StudentTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherTable" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "TeacherTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestTable" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "teacherID" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "yearId" INTEGER NOT NULL,
    "noofquestions" INTEGER NOT NULL,
    "noofstudents" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionsTable" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "QuestionsTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultTable" (
    "id" SERIAL NOT NULL,
    "totalmarks" INTEGER NOT NULL,
    "scoredmarks" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ResultTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BranchTable" ADD CONSTRAINT "BranchTable_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "UniversityTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTable" ADD CONSTRAINT "StudentTable_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "BranchTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTable" ADD CONSTRAINT "StudentTable_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "UniversityTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTable" ADD CONSTRAINT "StudentTable_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "YearTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherTable" ADD CONSTRAINT "TeacherTable_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "BranchTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherTable" ADD CONSTRAINT "TeacherTable_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "UniversityTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestTable" ADD CONSTRAINT "TestTable_teacherID_fkey" FOREIGN KEY ("teacherID") REFERENCES "TeacherTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestTable" ADD CONSTRAINT "TestTable_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "BranchTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestTable" ADD CONSTRAINT "TestTable_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "YearTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsTable" ADD CONSTRAINT "QuestionsTable_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
