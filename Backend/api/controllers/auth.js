const express = require('express');



const router = express.Router();
const studentRouter = require('./studentAuth');
const teacherRouter = require('./teachersAuth');
const testTeacher = require('./teachers'); 
const testStudent = require('./students');

router.use('/student', studentRouter);
router.use('/teacher', teacherRouter);
router.use('/testTeacher', testTeacher); 
router.use('/testStudent', testStudent);


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use('/student', studentRouter);
router.use('/teacher', teacherRouter);
router.use('/testTeacher', testTeacher); 
router.use('/testStudent', testStudent);

// Fetch branches by universityId
router.get('/branches/:universityId', async (req, res) => {
  const { universityId } = req.params;
  
  // Validate if universityId is a valid number
  const universityIdInt = parseInt(universityId);

  if (isNaN(universityIdInt)) {
    return res.status(400).json({ message: 'Invalid universityId' });
  }

  try {
    const branches = await prisma.BranchTable.findMany({
      where: { universityId: universityIdInt }, 
      select: { id: true, Branchname: true, Branchcode: true } 
    });
    
    // If no branches found
    if (!branches.length) {
      return res.status(404).json({ message: 'No branches found for this university' });
    }
    
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Error fetching branches', error: error.message });
  }
});

// Fetch students in a branch (Example of a query that can be written similarly)
router.get('/students/branch/:branchId', async (req, res) => {
  const { branchId } = req.params;

  try {
    const students = await prisma.StudentTable.findMany({
      where: { branchId: parseInt(branchId) },
      select: { id: true, firstname: true, lastname: true, email: true }
    });
    
    if (!students.length) {
      return res.status(404).json({ message: 'No students found in this branch' });
    }

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Fetch all universities (for the new fetchUniversities endpoint)
router.get('/universities', async (req, res) => {
  try {
    const universities = await prisma.UniversityTable.findMany({
      select: { id: true, name: true, address: true } // Select the fields to return
    });

    if (!universities.length) {
      return res.status(404).json({ message: 'No universities found' });
    }

    res.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ message: 'Error fetching universities', error: error.message });
  }
});

// Inside your backend router file (e.g., auth.js or routes.js)
router.get('/years/:universityId/:branchId', async (req, res) => {
  const { universityId, branchId } = req.params;

  // Validate if universityId and branchId are valid numbers
  const universityIdInt = parseInt(universityId);
  const branchIdInt = parseInt(branchId);

  if (isNaN(universityIdInt) || isNaN(branchIdInt)) {
    return res.status(400).json({ message: 'Invalid universityId or branchId' });
  }

  try {
    // Fetch years related to the university and branch from the YearTable
    const years = await prisma.YearTable.findMany({
      where: {
        universityId: universityIdInt, // Ensure the universityId matches
        branchId: branchIdInt, // Ensure the branchId matches
      },
      select: {
        id: true,
        name: true,
        year: true,
      },
    });

    // If no years found for the university and branch
    if (!years.length) {
      return res.status(404).json({ message: 'No years found for this university and branch' });
    }

    res.json(years);
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({ message: 'Error fetching years', error: error.message });
  }
});


module.exports = router;



