
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const studentSchema = z.object({
  admissionNo: z.string().trim().min(1).max(50),
  fullName: z.string().trim().min(2).max(150),
  classId: z.string().cuid().optional(),
  guardianName: z.string().trim().max(150).optional(),
  guardianPhone: z.string().trim().max(30).optional(),
  dateOfBirth: z.string().date().optional(),
});

router.get(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const schoolId = req.auth?.schoolId;
      if (!schoolId) {
        res.status(400).json({ error: "School is required." });
        return;
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(
        100,
        Math.max(1, Number(req.query.pageSize) || 20)
      );

      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim().slice(0, 100)
          : "";

      const where = {
        schoolId,
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" as const } },
                { admissionNo: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            admissionNo: true,
            fullName: true,
            guardianName: true,
            guardianPhone: true,
            dateOfBirth: true,
            classId: true,
            schoolClass: {
              select: { name: true, section: true },
            },
            createdAt: true,
          },
        }),
        prisma.student.count({ where }),
      ]);

      res.json({
        students,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch {
      res.status(500).json({ error: "Unable to load students." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = studentSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid student information.",
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
      const data = parsed.data;

      if (data.classId) {
        const schoolClass = await prisma.schoolClass.findFirst({
          where: {
            id: data.classId,
            schoolId,
          },
          select: { id: true },
        });

        if (!schoolClass) {
          res.status(400).json({
            error: "Selected class does not belong to this school.",
          });
          return;
        }
      }

      const student = await prisma.$transaction(async (tx) => {
        const created = await tx.student.create({
          data: {
            schoolId,
            admissionNo: data.admissionNo,
            fullName: data.fullName,
            classId: data.classId,
            guardianName: data.guardianName,
            guardianPhone: data.guardianPhone,
            dateOfBirth: data.dateOfBirth
              ? new Date(`${data.dateOfBirth}T00:00:00.000Z`)
              : undefined,
          },
          select: {
            id: true,
            admissionNo: true,
            fullName: true,
            classId: true,
            createdAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "STUDENT_CREATED",
            entityType: "Student",
            entityId: created.id,
            details: { admissionNo: created.admissionNo },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({ student });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          error: "That admission number already exists in this school.",
        });
        return;
      }

      res.status(500).json({ error: "Unable to create student." });
    }
  }
);

router.get(
  "/:studentId",
  ...requireSchoolRole("SCHOOL_ADMIN", "TEACHER"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const schoolId = req.auth?.schoolId;

      if (!schoolId) {
        res.status(400).json({ error: "School is required." });
        return;
      }

      const student = await prisma.student.findFirst({
        where: {
          id: req.params.studentId,
          schoolId,
        },
        select: {
          id: true,
          admissionNo: true,
          fullName: true,
          guardianName: true,
          guardianPhone: true,
          dateOfBirth: true,
          schoolClass: {
            select: { name: true, section: true },
          },
          createdAt: true,
        },
      });

      if (!student) {
        res.status(404).json({ error: "Student not found." });
        return;
      }

      res.json({ student });
    } catch {
      res.status(500).json({ error: "Unable to load student." });
    }
  }
);

export default router;
