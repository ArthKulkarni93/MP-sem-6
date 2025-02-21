const express = require('express');
const router = express.Router();
const studentRouter = require('./studentAuth');
const teacherRouter = require('./teachersAuth');
const testTeacher = require('./teachers'); // Add this line
const testStudent = require('./students');

router.use('/student', studentRouter);
router.use('/teacher', teacherRouter);
router.use('/testTeacher', testTeacher); // Add this line
router.use('/testStudent', testStudent);

module.exports = router;