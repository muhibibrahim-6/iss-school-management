
import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

const createFeeSchema = z.object({
  studentId: z.string().cuid(),
  description: z.string().trim().min(2).max(150),
  amount: z.number().finite().positive().max(100000000),
  paidAmount: z.number().finite().min(0).max(100000000).default(0),
  dueDate: z.string().date().optional(),
}).refine((value) => value.paidAmount <= value.amount, {
  message: "Paid amount cannot exceed the total fee.",
  path: ["paidAmount"],
});

const paymentSchema = z.object({
  paidAmount: z.number().finite().min(0).max(100000000),
});

router.get(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const schoolId = req.auth?.schoolId;

    if (!schoolId) {
      res.status(400).json({ error: "School is required." });
      return;
    }

    try {
      const fees = await prisma.feeRecord.findMany({
        where: { schoolId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          description: true,
          amount: true,
          paidAmount: true,
          dueDate: true,
          paidAt: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              admissionNo: true,
              fullName: true,
            },
          },
        },
      });

      res.json({
        fees: fees.map((fee) => ({
          ...fee,
          amount: fee.amount.toString(),
          paidAmount: fee.paidAmount.toString(),
          dueAmount: (
            Number(fee.amount) - Number(fee.paidAmount)
          ).toFixed(2),
        })),
        total: fees.length,
      });
    } catch {
      res.status(500).json({ error: "Unable to load fee records." });
    }
  }
);

router.post(
  "/",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const parsed = createFeeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid fee information.",
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
      const student = await prisma.student.findFirst({
        where: { id: parsed.data.studentId, schoolId },
        select: { id: true },
      });

      if (!student) {
        res.status(404).json({
          error: "Student not found in this school.",
        });
        return;
      }

      const data = parsed.data;
      const paid = new Prisma.Decimal(data.paidAmount);

      const fee = await prisma.$transaction(async (tx) => {
        const created = await tx.feeRecord.create({
          data: {
            schoolId,
            studentId: data.studentId,
            description: data.description,
            amount: new Prisma.Decimal(data.amount),
            paidAmount: paid,
            dueDate: data.dueDate
              ? new Date(`${data.dueDate}T00:00:00.000Z`)
              : undefined,
            paidAt: data.paidAmount > 0 ? new Date() : null,
          },
          select: {
            id: true,
            studentId: true,
            description: true,
            amount: true,
            paidAmount: true,
            dueDate: true,
            paidAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "FEE_RECORD_CREATED",
            entityType: "FeeRecord",
            entityId: created.id,
            details: {
              studentId: data.studentId,
              amount: data.amount,
              paidAmount: data.paidAmount,
            },
            ipAddress: req.ip,
          },
        });

        return created;
      });

      res.status(201).json({
        fee: {
          ...fee,
          amount: fee.amount.toString(),
          paidAmount: fee.paidAmount.toString(),
        },
      });
    } catch {
      res.status(500).json({ error: "Unable to create fee record." });
    }
  }
);

router.patch(
  "/:feeId/payment",
  ...requireSchoolRole("SCHOOL_ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const feeId = req.params.feeId;

    if (typeof feeId !== "string" || !feeId) {
      res.status(400).json({ error: "Invalid fee ID." });
      return;
    }

    const parsed = paymentSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Enter a valid paid amount.",
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
      const existing = await prisma.feeRecord.findFirst({
        where: {
          id: feeId,
          schoolId,
        },
        select: {
          id: true,
          amount: true,
        },
      });

      if (!existing) {
        res.status(404).json({ error: "Fee record not found." });
        return;
      }

      const paidAmount = new Prisma.Decimal(parsed.data.paidAmount);

      if (paidAmount.greaterThan(existing.amount)) {
        res.status(400).json({
          error: "Paid amount cannot exceed the total fee.",
        });
        return;
      }

      const updated = await prisma.$transaction(async (tx) => {
        const fee = await tx.feeRecord.update({
          where: { id: existing.id },
          data: {
            paidAmount,
            paidAt: paidAmount.greaterThan(0) ? new Date() : null,
          },
          select: {
            id: true,
            description: true,
            amount: true,
            paidAmount: true,
            paidAt: true,
          },
        });

        await tx.auditLog.create({
          data: {
            schoolId,
            actorId,
            action: "FEE_PAYMENT_UPDATED",
            entityType: "FeeRecord",
            entityId: fee.id,
            details: {
              paidAmount: parsed.data.paidAmount,
            },
            ipAddress: req.ip,
          },
        });

        return fee;
      });

      res.json({
        fee: {
          ...updated,
          amount: updated.amount.toString(),
          paidAmount: updated.paidAmount.toString(),
          dueAmount: (
            Number(updated.amount) - Number(updated.paidAmount)
          ).toFixed(2),
        },
      });
    } catch {
      res.status(500).json({ error: "Unable to update fee payment." });
    }
  }
);

export default router;
