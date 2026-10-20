
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireSchoolRole } from "../middleware/require-school-role.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

const router = Router();

router.get(
  "/summary",
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
      const [
        students,
        classes,
        teachers,
        exams,
        attendanceRecords,
        feeRecords,
      ] = await Promise.all([
        prisma.student.count({ where: { schoolId } }),
        prisma.schoolClass.count({ where: { schoolId } }),
        prisma.schoolMembership.count({
          where: { schoolId, role: "TEACHER" },
        }),
        prisma.exam.count({ where: { schoolId } }),
        prisma.attendance.findMany({
          where: {
            schoolId,
            date: { gte: start, lt: end },
          },
          select: { present: true },
        }),
        prisma.feeRecord.findMany({
          where: { schoolId },
          select: { amount: true, paidAmount: true },
        }),
      ]);

      const totalFee = feeRecords.reduce(
        (sum, fee) => sum + Number(fee.amount),
        0
      );

      const totalPaid = feeRecords.reduce(
        (sum, fee) => sum + Number(fee.paidAmount),
        0
      );

      const present = attendanceRecords.filter(
        (record) => record.present
      ).length;

      res.json({
        date,
        students,
        classes,
        teachers,
        exams,
        attendance: {
          recorded: attendanceRecords.length,
          present,
          absent: attendanceRecords.length - present,
          unrecorded: Math.max(
            0,
            students - attendanceRecords.length
          ),
        },
        fees: {
          totalAmount: totalFee.toFixed(2),
          totalPaid: totalPaid.toFixed(2),
          outstanding: (totalFee - totalPaid).toFixed(2),
          records: feeRecords.length,
        },
      });
    } catch {
      res.status(500).json({
        error: "Unable to generate school report.",
      });
    }
  }
);

export default router;
