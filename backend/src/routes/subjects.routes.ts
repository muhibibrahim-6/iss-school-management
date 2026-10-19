
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const subjectSchema = z.object({
  classId: z.string().cuid(),
  name: z.string().trim().min(1).max(100),
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
      const subjects = await prisma.subject.findMany({
        where: { schoolId },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          classId: true,
          schoolClass: {
            select: { name: true, section: true },
          },
          createdAt: true,
        },
      });

      res.json({ subjects, total: subjects.length });
    } catch {
      res.status(500).json({ error: "Unable to load subjects." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = subjectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid subject information.",
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
      const schoolClass = await prisma.schoolClass.findFirst({
        where: {
          id: parsed.data.classId,
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

      const subject = await prisma.$transaction(async (tx) => {
        const created = await tx.subject.create({
          data: {
            schoolId,
            classId: parsed.data.classId,
            name: parsed.data.name,
          },
          select: {
            id: true,
            name: true,
            classId: true,
            createdAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "SUBJECT_CREATED",
            entityType: "Subject",
            entityId: created.id,
            details: {
              name: created.name,
              classId: created.classId,
            },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({ subject });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          error: "That subject already exists for this class.",
        });
        return;
      }

      res.status(500).json({ error: "Unable to create subject." });
    }
  }
);

export default router;
