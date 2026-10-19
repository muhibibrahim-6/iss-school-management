
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const classSchema = z.object({
  name: z.string().trim().min(1).max(80),
  section: z.string().trim().max(40).optional(),
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
      const classes = await prisma.schoolClass.findMany({
        where: { schoolId },
        orderBy: [{ name: "asc" }, { section: "asc" }],
        select: {
          id: true,
          name: true,
          section: true,
          createdAt: true,
          _count: { select: { students: true, subjects: true } },
        },
      });

      res.json({ classes, total: classes.length });
    } catch {
      res.status(500).json({ error: "Unable to load classes." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = classSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid class information.",
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
      const schoolClass = await prisma.$transaction(async (tx) => {
        const created = await tx.schoolClass.create({
          data: {
            schoolId,
            name: parsed.data.name,
            section: parsed.data.section || null,
          },
          select: {
            id: true,
            name: true,
            section: true,
            createdAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "CLASS_CREATED",
            entityType: "SchoolClass",
            entityId: created.id,
            details: {
              name: created.name,
              section: created.section,
            },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({ class: schoolClass });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          error: "That class and section already exist in this school.",
        });
        return;
      }

      res.status(500).json({ error: "Unable to create class." });
    }
  }
);

export default router;
