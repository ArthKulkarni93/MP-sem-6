const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// JWT verification middleware (same as before)
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const secret = process.env.jwtSecret; // Assuming it's stored in env
        const decoded = jwt.verify(token, secret);
        
        if (req.path.includes('student')) {
            req.studentId = decoded.studentId;
        } else if (req.path.includes('teacher')) {
            req.teacherId = decoded.teacherId;
        }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Endpoint to get student's results for a specific test (Only for students)
router.get('/student/results/:testId', verifyJWT, async (req, res) => {
    const { testId } = req.params;
    const { studentId } = req;

    try {
        const result = await prisma.resultTable.findFirst({
            where: {
                testId: parseInt(testId),
                studentId: parseInt(studentId),
            },
            include: {
                test: {
                    select: {
                        title: true,
                        scheduledDate: true,
                        totalmarks: true,
                        teacher: {
                            select: {
                                firstname: true,
                                lastname: true,
                            },
                        },
                    },
                },
            },
        });

        if (result) {
            res.json({ ...result, totalmarks: result.test.totalmarks });
        } else {
            return res.status(404).json({ msg: 'No results found for this test' });
        }
    } catch (error) {
        console.error("Error fetching student results:", error);
        res.status(500).json({ msg: 'An error occurred while fetching results' });
    }
});

//http://localhost:5001/api/v1/auth/student/responses/19
router.get('/student/responses/:testId', verifyJWT, async (req, res) => {
    const { testId } = req.params;
    const { studentId } = req; // assuming this is set by verifyJWT middleware
  
    try {
      const responses = await prisma.studentResponseTable.findMany({
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
      console.log(responses);
  
      return res.json({ responses });
    } catch (error) {
      console.error("Error fetching student responses:", error);
      return res.status(500).json({ msg: 'An error occurred while fetching responses' });
    }
  });
  
  



// Endpoint to get results for tests created by a teacher (Only for teachers)
router.get('/teacher/results/:testId', verifyJWT, async (req, res) => {
    const { testId } = req.params;
    const { teacherId } = req;

    try {
        // Check if the test belongs to the teacher
        const test = await prisma.testTable.findUnique({
            where: { id: parseInt(testId) },
            select: { teacher_Id: true, totalmarks: true }  // Changed to teacher_Id
        });

        if (!test || test.teacher_Id !== teacherId) {  // Changed to teacher_Id
            return res.status(403).json({ msg: 'You are not authorized to view these results' });
        }

        const results = await prisma.resultTable.findMany({
            where: { testId: parseInt(testId) },
            include: {
                student: {
                    select: {
                        firstname: true,
                        lastname: true,
                        PRN: true,
                        cheated: true,              // <--- Make sure to select the 'cheated' field
                        maxFaceCount: true,         // <--- And the security fields
                        tabSwitchCount: true,
                        fullScreenExits: true,
                    },
                },
            },
        });

        // Add totalmarks and scoredmarks to each result
        const resultsWithMarks = results.map(result => ({
            ...result,
            totalmarks: test.totalmarks,
            scoredmarks: result.scoredmarks // Assuming scoredmarks exists in ResultTable
        }));

        res.json(resultsWithMarks);
    } catch (error) {
        console.error("Error fetching teacher results:", error);
        res.status(500).json({ msg: 'An error occurred while fetching results' });
    }
});

  
module.exports = router;