
import type { NextFunction, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "./authenticate.js";

export function requireIssOwner() {
  return [
    authenticate,
    async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.auth) {
          res.status(401).json({
            error: "Authentication required.",
          });
          return;
        }

        const user = await prisma.user.findUnique({
          where: { id: req.auth.userId },
          select: {
            platformRole: true,
            status: true,
          },
        });

        if (
          !user ||
          user.status !== "ACTIVE" ||
          user.platformRole !== "ISS_OWNER"
        ) {
          res.status(403).json({
            error: "ISS Owner access is required.",
          });
          return;
        }

        next();
      } catch {
        res.status(500).json({
          error: "Unable to verify ISS Owner permissions.",
        });
      }
    },
  ];
}
