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

// //submit test
// router.post('/tests/:testId/submit', verifyJWT('student'), async (req, res) => {
//     const { answers } = req.body;
//     let score = 0;
    
//     try {
//         const questions = await prisma.QuestionsTable.findMany({
//             where: { testId: parseInt(req.params.testId) }
//         });

//         questions.forEach(question => {
//             const submittedAnswer = answers[question.id]?.toString().trim().toLowerCase();  // Ensure lowercase
//             const correctAnswer = question.correctOption?.toString().trim().toLowerCase(); // Ensure lowercase
            
//             if (submittedAnswer === correctAnswer) {
//                 score += question.maxMark;
//             }
//         });

//         const result = await prisma.ResultTable.create({
//             data: {
//                 testId: parseInt(req.params.testId),
//                 studentId: req.student.id,
//                 // totalmarks: questions.reduce((sum, q) => sum + q.maxMark, 0),
//                 totalmarks: questions.reduce((sum, q) => sum + q.maxMark , 0),
//                 scoredmarks: score
//             }
//         });
//         res.json(result);
//         console.log(res);
//     } catch (error) {
//         console.error("Error submitting test:", error);
//         res.status(500).json({ message: 'Error submitting test' });
//     }
// });

// Submit Student Test Responses
router.post('/tests/:testid/submit', verifyJWT('student'), async (req, res) => {
    const { testid } = req.params;
    const { answers, security } = req.body;

    // Get student id from the JWT
    const studentId = req.student.id;

    try {
        // Save the student's responses and determine if they cheated
        const responses = Object.keys(answers).map(async (questionId) => {
            const question = await prisma.QuestionsTable.findUnique({
                where: { id: parseInt(questionId) }
            });

            // Determine if the student's answer is correct
            const isCorrect = question.correctOption === answers[questionId].toUpperCase();

            // Save the response in StudentResponseTable
            await prisma.StudentResponseTable.create({
                data: {
                    studentId: studentId,
                    testId: parseInt(testid),
                    questionId: parseInt(questionId),
                    selectedOption: answers[questionId].toUpperCase(),
                    isCorrect: isCorrect
                }
            });
        });

        await Promise.all(responses);

        // Calculate whether the student has cheated
        let cheated = false;

        // Define cheating criteria based on security metrics
        if (security.tabSwitchCount > 0 || security.fullScreenExits > 0 || security.maxFaceCount > 1) {
            cheated = true;  // This should properly flag the student as having cheated.
        }

        // Save the student's result in ResultTable with 'cheated' flag and security metrics
        const totalMarks = await prisma.TestTable.findUnique({
            where: { id: parseInt(testid) },
            select: { totalmarks: true }
        });

        // Calculate scored marks based on correct answers
        const scoredMarks = await prisma.StudentResponseTable.count({
            where: {
                studentId: studentId,
                testId: parseInt(testid),
                isCorrect: true
            }
        });
        console.log("security.tabSwitchCount: " ,security.tabSwitchCount)
        console.log("security.fullScreenExits: " ,security.fullScreenExits)
        console.log("security.maxFaceCount: " ,security.maxFaceCount)

        await prisma.ResultTable.create({
            data: {
                totalmarks: totalMarks.totalmarks,
                scoredmarks: scoredMarks,
                cheated: cheated,
                testId: parseInt(testid),
                studentId: studentId,
                tabSwitchCount: parseInt(security.tabSwitchCount),  // ✅ Storing tab switches
                fullScreenExits: parseInt(security.fullScreenExits), // ✅ Storing fullscreen exits
                maxFaceCount: parseInt(security.maxFaceCount)       // ✅ Storing max detected faces
            }
        });

        res.status(201).json({ message: 'Test submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting test' });
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
  

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { verifyJWT } = require('../middleware/auth');

// // Get Available Tests
// router.get('/tests', verifyJWT('student'), async (req, res) => {
//     const now = new Date();
    
//     try {
//         const tests = await prisma.TestTable.findMany({
//             where: {
//                 yearId: req.student.yearId,
//                 branchId: req.student.branchId,
//                 scheduledDate: { lte: now } // Students can only see available tests
//             }
//         });
//         res.json(tests);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching tests' });
//     }
// });

// // Submit Test
// router.post('/tests/:testId/submit', verifyJWT('student'), async (req, res) => {
//     const { answers } = req.body;
//     let score = 0;
    
//     try {
//         const questions = await prisma.QuestionsTable.findMany({
//             where: { testId: parseInt(req.params.testId) }
//         });

//         questions.forEach(question => {
//             if (answers[question.id] === question.correctOption) {
//                 score += question.marks;
//             }
//         });

//         const result = await prisma.ResultTable.create({
//             data: {
//                 testId: parseInt(req.params.testId),
//                 studentId: req.student.id,
//                 totalmarks: questions.reduce((sum, q) => sum + q.marks, 0),
//                 scoredmarks: score
//             }
//         });
        
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error submitting test' });
//     }
// });

// // Get Student's Past Results
// router.get('/results', verifyJWT('student'), async (req, res) => {
//     try {
//         const results = await prisma.ResultTable.findMany({
//             where: { studentId: req.student.id },
//             include: { test: { select: { title: true, subject: true, scheduledDate: true } } }
//         });

//         res.json(results);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching results' });
//     }
// });

// module.exports = router;