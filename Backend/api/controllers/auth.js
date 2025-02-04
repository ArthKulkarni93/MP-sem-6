const express = require('express');
const router = express.Router();
const studentRouter = require('./studentAuth');
const teacherRouter = require('./teachersAuth');
const testRouter = require('./teachers'); // Add this line

router.use('/student', studentRouter);
router.use('/teacher', teacherRouter);
router.use('/test', testRouter); // Add this line

module.exports = router;