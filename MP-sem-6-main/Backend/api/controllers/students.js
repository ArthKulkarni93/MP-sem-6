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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tests' });
    }
});

// Submit Test
router.post('/tests/:testId/submit', verifyJWT('student'), async (req, res) => {
    const { answers } = req.body;
    let score = 0;
    
    try {
        const questions = await prisma.QuestionsTable.findMany({
            where: { testId: parseInt(req.params.testId) }
        });

        questions.forEach(question => {
            if (answers[question.id] === question.correctOption) {
                score += question.maxMark;
            }
        });

        const result = await prisma.ResultTable.create({
            data: {
                testId: parseInt(req.params.testId),
                studentId: req.student.id,
                totalmarks: questions.reduce((sum, q) => sum + q.marks, 0),
                scoredmarks: score
            }
        });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting test' });
    }
});

// Get Student's Past Results
router.get('/results', verifyJWT('student'), async (req, res) => {
    try {
        const results = await prisma.ResultTable.findMany({
            where: { studentId: req.student.id },
            include: { test: { select: { title: true, subject: true, scheduledDate: true } } }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
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
