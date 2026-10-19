
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const attendanceSchema = z.object({
  studentId: z.string().cuid(),
  date: z.string().date(),
  present: z.boolean(),
  note: z.string().trim().max(300).optional(),
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

    const date =
      typeof req.query.date === "string"
        ? req.query.date
        : new Date().toISOString().slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Use date format YYYY-MM-DD." });
      return;
    }

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    try {
      const records = await prisma.attendance.findMany({
        where: {
          schoolId,
          date: { gte: start, lt: end },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          studentId: true,
          date: true,
          present: true,
          note: true,
          student: {
            select: {
              admissionNo: true,
              fullName: true,
              classId: true,
            },
          },
        },
      });

      res.json({
        date,
        total: records.length,
        present: records.filter((record) => record.present).length,
        absent: records.filter((record) => !record.present).length,
        records,
      });
    } catch {
      res.status(500).json({ error: "Unable to load attendance." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = attendanceSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid attendance information.",
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
    const start = new Date(`${data.date}T00:00:00.000Z`);

    try {
      const student = await prisma.student.findFirst({
        where: {
          id: data.studentId,
          schoolId,
        },
        select: { id: true },
      });

      if (!student) {
        res.status(404).json({
          error: "Student not found in this school.",
        });
        return;
      }

      const record = await prisma.$transaction(async (tx) => {
        const created = await tx.attendance.create({
          data: {
            schoolId,
            studentId: data.studentId,
            date: start,
            present: data.present,
            note: data.note,
          },
          select: {
            id: true,
            studentId: true,
            date: true,
            present: true,
            note: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "ATTENDANCE_RECORDED",
            entityType: "Attendance",
            entityId: created.id,
            details: {
              studentId: data.studentId,
              date: data.date,
              present: data.present,
            },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({ record });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          error: "Attendance has already been recorded for this student and date.",
        });
        return;
      }

      res.status(500).json({ error: "Unable to record attendance." });
    }
  }
);

export default router;
