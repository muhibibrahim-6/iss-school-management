
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../lib/auth.js";
import type { Role } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email: string;
    schoolId?: string;
    role?: Role;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const token = authorization.slice(7).trim();

    if (!token || token.length > 4096) {
      res.status(401).json({ error: "Invalid access token." });
      return;
    }

    const payload = verifyAccessToken(token);

    if (!payload.sub || typeof payload.email !== "string") {
      res.status(401).json({ error: "Invalid access token." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE" || user.email !== payload.email) {
      res.status(401).json({ error: "Account is not active." });
      return;
    }

    req.auth = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired access token." });
  }
}

export function requireRole(...allowedRoles: Role[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.auth) {
        res.status(401).json({ error: "Authentication required." });
        return;
      }

      const schoolId = req.header("x-school-id");

      if (!schoolId) {
        res.status(400).json({ error: "School ID is required." });
        return;
      }

      const membership = await prisma.schoolMembership.findFirst({
        where: {
          userId: req.auth.userId,
          schoolId,
          role: { in: allowedRoles },
          school: { status: "ACTIVE" },
        },
        select: {
          role: true,
          schoolId: true,
        },
      });

      if (!membership) {
        res.status(403).json({
          error: "You do not have permission to access this school.",
        });
        return;
      }

      req.auth.schoolId = membership.schoolId;
      req.auth.role = membership.role;

      next();
    } catch {
      res.status(500).json({ error: "Authorization check failed." });
    }
  };
}
