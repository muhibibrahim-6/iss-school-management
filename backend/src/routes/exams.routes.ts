
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const examSchema = z.object({
  name: z.string().trim().min(2).max(120),
  examDate: z.string().date().optional(),
});

const marksSchema = z.object({
  examId: z.string().cuid(),
  studentId: z.string().cuid(),
  subjectId: z.string().cuid(),
  marks: z.number().finite().min(0).max(1000),
});

router.get(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    const schoolId = req.auth?.schoolId;

    if (!schoolId) {
      res.status(400).json({ error: "School is required." });
      return;
    }

    try {
      const exams = await prisma.exam.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          examDate: true,
          createdAt: true,
          _count: { select: { marks: true } },
        },
      });

      res.json({ exams, total: exams.length });
    } catch {
      res.status(500).json({ error: "Unable to load exams." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = examSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid exam information.",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const schoolId = req.auth?.schoolId;
    const actorId = req.auth?.userId;

    if (!schoolId || !actorId) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    try {
      const exam = await prisma.$transaction(async (tx) => {
        const created = await tx.exam.create({
          data: {
            schoolId,
            name: parsed.data.name,
            examDate: parsed.data.examDate
              ? new Date(`${parsed.data.examDate}T00:00:00.000Z`)
              : undefined,
          },
          select: {
            id: true,
            name: true,
            examDate: true,
            createdAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "EXAM_CREATED",
            entityType: "Exam",
            entityId: created.id,
            details: { name: created.name },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({ exam });
    } catch {
      res.status(500).json({ error: "Unable to create exam." });
    }
  }
);

router.post(
  "/marks",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = marksSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid marks information.",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const schoolId = req.auth?.schoolId;
    const actorId = req.auth?.userId;

    if (!schoolId || !actorId) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const data = parsed.data;

    try {
      const [exam, student, subject] = await Promise.all([
        prisma.exam.findFirst({
          where: { id: data.examId, schoolId },
          select: { id: true },
        }),
        prisma.student.findFirst({
          where: { id: data.studentId, schoolId },
          select: { id: true, classId: true },
        }),
        prisma.subject.findFirst({
          where: { id: data.subjectId, schoolId },
          select: { id: true, classId: true },
        }),
      ]);

      if (!exam || !student || !subject) {
        res.status(400).json({
          error: "Exam, student, and subject must belong to this school.",
        });
        return;
      }

      if (student.classId && student.classId !== subject.classId) {
        res.status(400).json({
          error: "The subject does not belong to the student's class.",
        });
        return;
      }

      const result = await prisma.$transaction(async (tx) => {
        const mark = await tx.examMark.upsert({
          where: {
            examId_studentId_subjectId: {
              examId: data.examId,
              studentId: data.studentId,
              subjectId: data.subjectId,
            },
          },
          create: {
            examId: data.examId,
            studentId: data.studentId,
            subjectId: data.subjectId,
            marks: data.marks,
          },
          update: {
            marks: data.marks,
          },
          select: {
            id: true,
            examId: true,
            studentId: true,
            subjectId: true,
            marks: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "EXAM_MARK_SAVED",
            entityType: "ExamMark",
            entityId: mark.id,
            details: {
              examId: data.examId,
              studentId: data.studentId,
              subjectId: data.subjectId,
              marks: data.marks,
            },
            ipAddress: req.ip,
          },
        });

        return mark;
      });

      res.json({ result });
    } catch {
      res.status(500).json({ error: "Unable to save exam marks." });
    }
  }
);

router.get(
  "/:examId/results",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    const schoolId = req.auth?.schoolId;
    const examId = req.params.examId;

    if (!schoolId) {
      res.status(400).json({ error: "School is required." });
      return;
    }

    if (typeof examId !== "string" || !examId) {
      res.status(400).json({ error: "Invalid exam ID." });
      return;
    }

    try {
      const exam = await prisma.exam.findFirst({
        where: {
          id: examId,
          schoolId,
        },
        select: { id: true, name: true, examDate: true },
      });

      if (!exam) {
        res.status(404).json({ error: "Exam not found." });
        return;
      }

      const results = await prisma.examMark.findMany({
        where: { examId: exam.id },
        orderBy: [
          { student: { fullName: "asc" } },
          { subject: { name: "asc" } },
        ],
        select: {
          id: true,
          marks: true,
          student: {
            select: { id: true, admissionNo: true, fullName: true },
          },
          subject: {
            select: { id: true, name: true },
          },
        },
      });

      res.json({ exam, results, total: results.length });
    } catch {
      res.status(500).json({ error: "Unable to load exam results." });
    }
  }
);

export default router;
