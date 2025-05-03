const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const csv = require('csv-parser');
const { verifyJWT } = require('../middleware/auth');
const fs = require('fs');
const env = require('dotenv');
const cloudinary = require('cloudinary').v2 

env.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET
})

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

const axios = require('axios');
const streamifier = require('streamifier');

// Upload Questions via CSV (updated to Cloudinary)
router.post('/tests/:testid/questions', verifyJWT('teacher'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploaded. make sure the field name is 'file'." });
    }

    try {
        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'raw',
            folder: 'test-csvs'
        });

        console.log("uploaded to cloudinary:", cloudinaryResponse.secure_url);

        // Download file from Cloudinary
        const response = await axios.get(cloudinaryResponse.secure_url, { responseType: 'stream' });

        const results = [];

        response.data
            .pipe(csv())
            .on('data', (data) => {
                console.log("parsed csv row:", data);
                results.push({
                    queText: data.queText,
                    optionA: data.optionA,
                    optionB: data.optionB,
                    optionC: data.optionC,
                    optionD: data.optionD,
                    correctOption: data.correctOption.toUpperCase(),
                    maxMark: parseInt(data.maxMark),
                    testId: parseInt(req.params.testid),
                });
            })
            .on('end', async () => {
                try {
                    console.log("uploading questions:", results);
                    await prisma.QuestionsTable.createMany({ data: results });
                    res.status(201).json({ message: 'questions uploaded successfully', cloudinaryUrl: cloudinaryResponse.secure_url });
                } catch (error) {
                    console.error("prisma error:", error.message);
                    res.status(500).json({ message: 'error uploading questions', error: error.message });
                }
            });
    } catch (error) {
        console.error("error in cloud upload or processing:", error);
        res.status(500).json({ message: 'error uploading and processing csv', error: error.message });
    } finally {
        // Cleanup local file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("error deleting local file:", err);
            else console.log("local file deleted");
        });
    }
});

// router.post('/tests/:testid/questions', verifyJWT('teacher'), upload.single('file'), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "no file uploaded. make sure the field name is 'file'." });
//     }

//     const results = [];

//     fs.createReadStream(req.file.path)

//         .pipe(csv())
//         .on('data', (data) => {
//             console.log("parsed csv row:", data); // debugging

//             results.push({
//                 queText: data.queText,  // ✅ ensure exact match with csv
//                 optionA: data.optionA,
//                 optionB: data.optionB,
//                 optionC: data.optionC,
//                 optionD: data.optionD,
//                 correctOption: data.correctOption.toUpperCase(), // ensure "a", "b", "c", "d"
//                 maxMark: parseInt(data.maxMark), // convert to integer
//                 testId: parseInt(req.params.testid),
//             });
//         })
//         .on('end', async () => {
//             try {
//                 console.log("uploading questions:", results); // debugging

//                 await prisma.QuestionsTable.createMany({ data: results }); // ✅ Correct model & function
//                 res.status(201).json({ message: 'questions uploaded successfully' });
//             } catch (error) {
//                 console.error("prisma error:", error.message); // debugging
//                 res.status(500).json({ message: 'error uploading questions', error: error.message });
//             }
//         });
// });

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
        console.log("inside tests/testid/results1")
        const results = await prisma.ResultTable.findMany({
            where: { testId: test.id },
            select: {
                scoredmarks: true,
                totalmarks: true,
                cheated: true,
                tabSwitchCount: true,  // ✅ Now selected from ResultTable
                fullScreenExits: true, // ✅ Now selected from ResultTable
                maxFaceCount: true,    // ✅ Now selected from ResultTable
                student: {
                    select: {
                        PRN: true,
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                }
            }
        });
        
        console.log("inside tests/testid/results2")
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching results',
            error: error.message
        });
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
  

  router.post('/notes', verifyJWT('teacher'), async (req, res) => {
    try {
      const { title, description, driveLink, yearid, branchid } = req.body;
  
      const teacher = req.teacher; // populated by verifyJWT middleware
  
      // Convert IDs to integers and validate them
      const yearId = parseInt(yearid);
      const branchId = parseInt(branchid);
  
      if (isNaN(yearId) || isNaN(branchId)) {
        return res.status(400).json({ message: 'Invalid year or branch ID' });
      }
  
      // Fetch year with branch and university to validate ownership
      const year = await prisma.YearTable.findUnique({
        where: { id: yearId },
      });
  
      if (!year) {
        return res.status(404).json({ message: 'Year not found' });
      }
  

    //   console.log(year.universityId)
    //   console.log(teacher.universityId)
    //   console.log(year.branchId)
    //   console.log(branchId)
      if (
        year.universityId !== teacher.universityId ||
        year.branchId !== branchId
      ) {
        return res.status(403).json({
          message: 'You are not authorized to upload notes for this year or branch',
        });
      }
  
      // Create the note
    //   console.log(title, description, driveLink, yearId, branchId, teacher.universityId)
      const notes = await prisma.NotesTable.create({
        data: {
          title,
          description,
          driveLink,
          yearId: yearId,
          branchId: branchId,
          universityId: teacher.universityId,
          teacherId: teacher.id,
        },
      });
  
      res.status(201).json({ message: 'Notes uploaded successfully', notes });
    } catch (error) {
      console.error('Error uploading notes:', error);
      res
        .status(500)
        .json({ message: 'Error uploading notes', error: error.message });
    }
  });
  
module.exports = router;


//S3 Standard - General purpose storage for any type of data, typically used for frequently accessed data	
//First 50 TB / Month	$0.023 per GB