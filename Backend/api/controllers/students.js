const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyJWT } = require('../middleware/auth');

// Get Available Tests
router.get('/tests', verifyJWT('student'), async (req, res) => {
    const now = new Date();
    
    try {
        const tests = await prisma.TestTable.findMany({
            where: {
                yearId: req.student.yearId,
                branchId: req.student.branchId,
                scheduledDate: { lte: now } // Students can only see available tests
            }
        });
        res.json(tests);

        console.log("Current Date:", now);
        // console.log("Scheduled Date:", test.scheduledDate);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tests' });
    }
});


// Submit Student Test Responses
router.post('/tests/:testid/submit', verifyJWT('student'), async (req, res) => {
  const { testid } = req.params;
  const { answers, security } = req.body;
  const studentId = req.student.id; // from JWT

  try {
    // 1️⃣ Prevent duplicate submissions
    const existing = await prisma.ResultTable.findFirst({
      where: {
        testId:   parseInt(testid,  10),
        studentId: studentId,
      },
    });
    if (existing) {
      return res.status(400).json({ message: 'Test already submitted' });
    }

    // 2️⃣ Save each response
    const responsePromises = Object.keys(answers).map(async (questionId) => {
      const q = await prisma.QuestionsTable.findUnique({
        where: { id: parseInt(questionId, 10) },
      });
      const isCorrect = q.correctOption === answers[questionId].toUpperCase();

      return prisma.StudentResponseTable.create({
        data: {
          studentId:     studentId,
          testId:        parseInt(testid, 10),
          questionId:    parseInt(questionId, 10),
          selectedOption: answers[questionId].toUpperCase(),
          isCorrect:      isCorrect,
        },
      });
    });
    await Promise.all(responsePromises);

    // 3️⃣ Compute cheating flag
    let cheated = false;
    if (security.tabSwitchCount  > 0 ||
        security.fullScreenExits > 0 ||
        security.maxFaceCount    > 1) {
      cheated = true;
    }

    // 4️⃣ Gather marks
    const { totalmarks } = await prisma.TestTable.findUnique({
      where:  { id: parseInt(testid, 10) },
      select: { totalmarks: true },
    });

    const scoredMarks = await prisma.StudentResponseTable.count({
      where: {
        studentId: studentId,
        testId:    parseInt(testid, 10),
        isCorrect: true,
      },
    });

    // 5️⃣ Create the single ResultTable record
    await prisma.ResultTable.create({
      data: {
        totalmarks:      totalmarks,
        scoredmarks:     scoredMarks,
        cheated:         cheated,
        testId:          parseInt(testid, 10),
        studentId:       studentId,
        tabSwitchCount:  parseInt(security.tabSwitchCount,  10),
        fullScreenExits: parseInt(security.fullScreenExits, 10),
        maxFaceCount:    parseInt(security.maxFaceCount,    10),
      },
    });

    return res.status(201).json({ message: 'Test submitted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error submitting test' });
  }
});


// Get Student's Past Results
router.get('/results', verifyJWT('student'), async (req, res) => {
    try {
        const results = await prisma.ResultTable.findMany({
            where: { studentId: req.student.id },
            include: { test: { select: { title: true, subject: true, scheduledDate: true , duration: true } } }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
});

// Get a single test's details (for student)
router.get('/tests/:testid', verifyJWT('student'), async (req, res) => {
    try {
      const test = await prisma.TestTable.findUnique({
        where: { id: parseInt(req.params.testid) }
      });
      if (!test) return res.status(404).json({ message: 'Test not found' });
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching test details' });
    }
  });
  
  // Get test questions for a student
  router.get('/tests/:testid/questions', verifyJWT('student'), async (req, res) => {
    try {
      const questions = await prisma.QuestionsTable.findMany({
        where: { testId: parseInt(req.params.testid) }
      });
      res.status(200).json(questions);
    } catch (error) {
      console.error("Error fetching questions for student:", error);
      res.status(500).json({ message: 'Error fetching questions for student' });
    }
  });

  router.get('/responses/:testId', verifyJWT('student'), async (req, res) => {
    const { testId } = req.params;
    const studentId = req.student?.id;
 // assuming this is set by verifyJWT middleware
  
    try {
      const responses = await prisma.StudentResponseTable.findMany({
        where: {
          testId: parseInt(testId),
          studentId: parseInt(studentId),
        },
        select: {
          selectedOption: true,
          isCorrect: true,
          student: {
            select: {
              PRN: true,
              firstname: true,
              lastname: true,
            },
          },
          question: {
            select: {
              queText: true,
              correctOption: true,
              maxMark: true,
            },
          },
        },
      });
      
      if (!responses || responses.length === 0) {
        return res.status(404).json({ msg: 'No responses found for this test' });
      }
    //   console.log(responses);
  
      return res.json({ responses });
    } catch (error) {
      console.error("Error fetching student responses:", error);
      return res.status(500).json({ msg: 'An error occurred while fetching responses' });
    }
  });
  
  router.get('/notes', verifyJWT('student'), async (req, res) => {
    try {
      const student = req.student;
  
      const notes = await prisma.NotesTable.findMany({
        where: {
          universityId: student.universityId,
          yearId: student.yearId,
          branchId: student.branchId,
        },
        include: {
          teacher: {
            select: {
              firstname: true,
              lastname: true,
              email: true
            }
          }
        }
      });
  
      res.status(200).json(notes);
    } catch (error) {
      console.error("error fetching notes:", error);
      res.status(500).json({ message: 'error fetching notes', error: error.message });
    }
  });
  
  

module.exports = router;



