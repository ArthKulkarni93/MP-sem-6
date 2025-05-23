const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const prisma = new PrismaClient();

env.config();
// Helper function for error handling
const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ msg: 'An error occurred' });
};


const jwtSecret =  process.env.jwtSecret

// Student signup route
router.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password, PRN, branchId, universityId, yearId } = req.body;
    console.log("pribt",firstname)
    try {
        const existingUser = await prisma.StudentTable.findFirst({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const student = await prisma.StudentTable.create({
            data: {
                firstname,
                lastname,
                email,
                password, // Storing password in plain text - SECURITY RISK
                PRN,
                branchId: parseInt(branchId),
                universityId: parseInt(universityId),
                yearId: parseInt(yearId),
            },
        });

        const token = jwt.sign({ studentId: student.id }, jwtSecret);
        res.status(201).json({ msg: 'User created successfully', token });
    } catch (error) {
        handleError(res, error);
    }
});

// Student signin route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await prisma.StudentTable.findFirst({
            where: { email },
        });

        if (!student || student.password !== password) { 
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ studentId: student.id }, jwtSecret);
        res.json({ msg: 'Signin successful', token });
    } catch (error) {
        handleError(res, error);
    }
});

// JWT verification middleware
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        req.studentId = decoded.studentId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// GET student profile (protected)
router.get('/profile', verifyJWT, async (req, res) => {
    try {
      const student = await prisma.StudentTable.findUnique({
        where: { id: req.studentId },
      });
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      res.status(500).json({ msg: 'Error fetching student profile' });
    }
  });
// Update student profile (protected route)
router.put('/update', verifyJWT, async (req, res) => {
    const { firstname, lastname, email, PRN, branchId, universityId, yearId } = req.body;
    try {
        const updatedStudent = await prisma.StudentTable.update({
            where: { id: req.studentId },
            data: {
                firstname,
                lastname,
                email,
                PRN,
                branchId: parseInt(branchId),
                universityId: parseInt(universityId),
                yearId: parseInt(yearId),
            },
        });
        res.json({ msg: 'Profile updated', student: updatedStudent });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;