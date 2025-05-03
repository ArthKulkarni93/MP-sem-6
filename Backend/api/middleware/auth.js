


const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
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

            const TeacherSchema = z.object({
                id: z.number(),
                firstname: z.string(),
                lastname: z.string(),
                email: z.string().email(),
                password: z.string(),
                branchId: z.number(),
                universityId: z.number()
            });

            const parsed = TeacherSchema.safeParse(teacher);
            if (!parsed.success) return res.status(403).json({ message: 'Invalid teacher data format' });

            req.teacher = parsed.data;
        } else if (role === 'student') {
            const student = await prisma.studentTable.findUnique({
                where: { id: decoded.studentId }
            });

            const StudentSchema = z.object({
                id: z.number(),
                firstname: z.string(),
                lastname: z.string(),
                email: z.string().email(),
                password: z.string(),
                PRN: z.string(),
                branchId: z.number(),
                universityId: z.number(),
                yearId: z.number()
            });

            const parsed = StudentSchema.safeParse(student);
            if (!parsed.success) return res.status(403).json({ message: 'Invalid student data format' });

            req.student = parsed.data;
        }

        req.universityId = decoded.universityId;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyJWT };
