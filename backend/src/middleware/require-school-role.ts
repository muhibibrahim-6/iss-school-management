
import type { NextFunction, Response } from "express";
import type { Role } from "@prisma/client";
import {
  authenticate,
  type AuthenticatedRequest,
} from "./authenticate.js";
import { prisma } from "../lib/prisma.js";

export function requireSchoolRole(...roles: Role[]) {
  return [
    authenticate,
    async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const schoolId = req.header("x-school-id");

        if (!schoolId) {
          res.status(400).json({
            error: "X-School-ID header is required.",
          });
          return;
        }

        if (!req.auth) {
          res.status(401).json({
            error: "Authentication required.",
          });
          return;
        }

        const membership = await prisma.schoolMembership.findFirst({
          where: {
            userId: req.auth.userId,
            schoolId,
            role: { in: roles },
            school: { status: "ACTIVE" },
          },
          select: {
            schoolId: true,
            role: true,
          },
        });

        if (!membership) {
          res.status(403).json({
            error: "You are not authorized for this school.",
          });
          return;
        }

        req.auth.schoolId = membership.schoolId;
        req.auth.role = membership.role;

        next();
      } catch {
        res.status(500).json({
          error: "Permission check failed.",
        });
      }
    },
  ];
}
