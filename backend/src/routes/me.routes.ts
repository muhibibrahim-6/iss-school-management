
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/authenticate.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.auth) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authReq.auth.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        memberships: {
          select: {
            role: true,
            school: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
                logoUrl: true,
                primaryColor: true,
                accentColor: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Account not found." });
      return;
    }

    res.json({ user });
  } catch {
    res.status(500).json({ error: "Unable to load profile." });
  }
});

export default router;
