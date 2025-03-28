const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const csv = require('csv-parser');
const { verifyJWT } = require('../middleware/auth');
const fs = require('fs');

// Create Test
router.post('/tests', verifyJWT('teacher'), async (req, res) => {
    const { title, subject, yearId, branchId, scheduledDate, duration, totalmarks } = req.body;
        
    try {
        const test = await prisma.TestTable.create({
            data: {
                title,
                subject,
                yearId: parseInt(yearId),
                branchId: parseInt(branchId),
                scheduledDate: new Date(scheduledDate),
                duration: parseInt(duration), // ✅ Now storing duration
                totalmarks: parseInt(totalmarks),
                teacherID: req.teacher.id
            }
        });
        res.status(201).json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating test' });
    }
});


// Upload Questions via CSV
const upload = multer({ dest: 'uploads/' });

router.post('/tests/:testid/questions', verifyJWT('teacher'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploaded. make sure the field name is 'file'." });
    }

    const results = [];

    fs.createReadStream(req.file.path)

        .pipe(csv())
        .on('data', (data) => {
            console.log("parsed csv row:", data); // debugging

            results.push({
                queText: data.queText,  // ✅ ensure exact match with csv
                optionA: data.optionA,
                optionB: data.optionB,
                optionC: data.optionC,
                optionD: data.optionD,
                correctOption: data.correctOption.toUpperCase(), // ensure "a", "b", "c", "d"
                maxMark: parseInt(data.maxMark), // convert to integer
                testId: parseInt(req.params.testid),
            });
        })
        .on('end', async () => {
            try {
                console.log("uploading questions:", results); // debugging

                await prisma.QuestionsTable.createMany({ data: results }); // ✅ Correct model & function
                res.status(201).json({ message: 'questions uploaded successfully' });
            } catch (error) {
                console.error("prisma error:", error.message); // debugging
                res.status(500).json({ message: 'error uploading questions', error: error.message });
            }
        });
});

// Get Teacher's Tests
router.get('/tests', verifyJWT('teacher'), async (req, res) => {
    try {
        const tests = await prisma.TestTable.findMany({
            where: { teacherID: req.teacher.id }
        });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tests' });
    }
});

// Get Test Results (Teacher can see all student marks)
router.get('/tests/:testId/results', verifyJWT('teacher'), async (req, res) => {
    try {
        const test = await prisma.TestTable.findUnique({
            where: { id: parseInt(req.params.testId) }
        });

        if (!test || test.teacherID !== req.teacher.id) {
            return res.status(403).json({ message: 'Not authorized to view this test' });
        }

        const results = await prisma.ResultTable.findMany({
            where: { testId: test.id },
            include: { student: { select: {PRN: true, firstname: true, lastname: true, email: true } } }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
});
// Fetch Questions for a Specific Test
router.get('/tests/:testid/questions', verifyJWT('teacher'), async (req, res) => {
    try {
      const questions = await prisma.QuestionsTable.findMany({
        where: { testId: parseInt(req.params.testid) }
      });
      res.status(200).json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: 'Error fetching questions' });
    }
  });
  


module.exports = router;
