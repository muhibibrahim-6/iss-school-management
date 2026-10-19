
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireIssOwner } from "../middleware/require-iss-owner.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

router.use(...requireIssOwner());

router.get("/pending-schools", async (_req, res) => {
  try {
    const schools = await prisma.school.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        createdAt: true,
        memberships: {
          where: { role: "SCHOOL_ADMIN" },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
                status: true,
              },
            },
          },
        },
      },
    });

    res.json({ schools, total: schools.length });
  } catch {
    res.status(500).json({
      error: "Unable to load pending school registrations.",
    });
  }
});

const schoolIdSchema = z.object({
  schoolId: z.string().cuid(),
});

router.post("/:schoolId/approve", async (req: AuthenticatedRequest, res) => {
  const parsed = schoolIdSchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid school ID." });
    return;
  }

  const actorId = req.auth?.userId;

  if (!actorId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const school = await tx.school.findUnique({
        where: { id: parsed.data.schoolId },
        select: { id: true, status: true, name: true },
      });

      if (!school) {
        return { kind: "not-found" as const };
      }

      if (school.status !== "PENDING") {
        return { kind: "conflict" as const };
      }

      const admins = await tx.schoolMembership.findMany({
        where: {
          schoolId: school.id,
          role: "SCHOOL_ADMIN",
        },
        select: { userId: true },
      });

      await tx.school.update({
        where: { id: school.id },
        data: { status: "ACTIVE" },
      });

      await tx.user.updateMany({
        where: {
          id: { in: admins.map((admin) => admin.userId) },
          status: "PENDING",
        },
        data: { status: "ACTIVE" },
      });

      await tx.auditLog.create({
        data: {
          schoolId: school.id,
          actorId,
          action: "SCHOOL_APPROVED",
          entityType: "School",
          entityId: school.id,
          details: { schoolName: school.name },
          ipAddress: req.ip,
        },
      });

      return { kind: "approved" as const, schoolName: school.name };
    });

    if (result.kind === "not-found") {
      res.status(404).json({ error: "School not found." });
      return;
    }

    if (result.kind === "conflict") {
      res.status(409).json({
        error: "This school is not pending approval.",
      });
      return;
    }

    res.json({
      message: "School approved successfully.",
      schoolName: result.schoolName,
    });
  } catch {
    res.status(500).json({ error: "Unable to approve school." });
  }
});

router.post("/:schoolId/suspend", async (req: AuthenticatedRequest, res) => {
  const parsed = schoolIdSchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid school ID." });
    return;
  }

  const actorId = req.auth?.userId;

  if (!actorId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const school = await tx.school.findUnique({
        where: { id: parsed.data.schoolId },
        select: { id: true, status: true, name: true },
      });

      if (!school) {
        return { kind: "not-found" as const };
      }

      if (school.status === "SUSPENDED") {
        return { kind: "already-suspended" as const };
      }

      await tx.school.update({
        where: { id: school.id },
        data: { status: "SUSPENDED" },
      });

      await tx.auditLog.create({
        data: {
          schoolId: school.id,
          actorId,
          action: "SCHOOL_SUSPENDED",
          entityType: "School",
          entityId: school.id,
          details: { schoolName: school.name },
          ipAddress: req.ip,
        },
      });

      return { kind: "suspended" as const };
    });

    if (result.kind === "not-found") {
      res.status(404).json({ error: "School not found." });
      return;
    }

    if (result.kind === "already-suspended") {
      res.status(409).json({ error: "School is already suspended." });
      return;
    }

    res.json({ message: "School suspended successfully." });
  } catch {
    res.status(500).json({ error: "Unable to suspend school." });
  }
});

export default router;
