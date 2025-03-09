const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

const prisma = new PrismaClient();

// Helper function for error handling (can be further improved)
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ msg: 'An error occurred' });
};

env.config();
// **Security Note:** Replace with a strong, random secret key in a real application
const jwtSecret = process.env.jwtSecret; // MUST BE SECURE IN PRODUCTION

// Teacher signup route
router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, branchId, universityId } = req.body;

  try {
    const existingTeacher = await prisma.teacherTable.findFirst({
      where: { email },
    });

    if (existingTeacher) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const teacher = await prisma.teacherTable.create({
      data: {
        firstname,
        lastname,
        email,
        password, // Storing password in plain text - SECURITY RISK
        branchId: parseInt(branchId),
        universityId: parseInt(universityId),
      },
    });

    const token = jwt.sign({ teacherId: teacher.id }, jwtSecret);
    res.status(201).json({ msg: 'Teacher created successfully', token });
  } catch (error) {
    handleError(res, error);
  }
});

// Teacher signin route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await prisma.teacherTable.findFirst({
      where: { email },
    });

    if (!teacher || teacher.password !== password) { // Plain text comparison - SECURITY RISK
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ teacherId: teacher.id }, jwtSecret);
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
    req.teacherId = decoded.teacherId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
// GET teacher (admin) profile (protected)
router.get('/profile', verifyJWT, async (req, res) => {
  try {
    const teacher = await prisma.teacherTable.findUnique({
      where: { id: req.teacherId },
    });
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ msg: 'Error fetching teacher profile' });
  }
});
// Update teacher profile (protected route)
router.put('/update', verifyJWT, async (req, res) => {
  const { firstname, lastname, email, password, branchId, universityId } = req.body;
  try {
    const updatedTeacher = await prisma.teacherTable.update({
      where: { id: req.teacherId },
      data: {
        firstname,
        lastname,
        email,
        password, // Still storing password in plain text - SECURITY RISK
        branchId: parseInt(branchId),
        universityId: parseInt(universityId),
      },
    });
    res.json({ msg: 'Profile updated', teacher: updatedTeacher });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;