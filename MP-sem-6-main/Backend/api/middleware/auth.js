const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyJWT = (role) => async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        
        if (role === 'teacher') {
            const teacher = await prisma.teacherTable.findUnique({
                where: { id: decoded.teacherId }
            });
            if (!teacher) return res.status(403).json({ message: 'Invalid token' });
            req.teacher = teacher;
        } else if (role === 'student') {
            const student = await prisma.studentTable.findUnique({
                where: { id: decoded.studentId }
            });
            if (!student) return res.status(403).json({ message: 'Invalid token' });
            req.student = student;
        }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyJWT };