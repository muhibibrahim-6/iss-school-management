
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  createAccessToken,
  hashPassword,
  verifyPassword,
} from "../lib/auth.js";
import {
  loginSchema,
  registerSchema,
} from "../lib/validation.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Try again later.",
  },
});

router.post("/register-school", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid registration information.",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const schoolName =
    typeof req.body.schoolName === "string"
      ? req.body.schoolName.trim()
      : "";

  const schoolSlug =
    typeof req.body.schoolSlug === "string"
      ? req.body.schoolSlug.trim().toLowerCase()
      : "";

  if (schoolName.length < 2 || schoolName.length > 150) {
    res.status(400).json({
      error: "School name must be between 2 and 150 characters.",
    });
    return;
  }

  if (
    schoolSlug.length < 3 ||
    schoolSlug.length > 60 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(schoolSlug)
  ) {
    res.status(400).json({
      error:
        "School slug must use lowercase letters, numbers, and hyphens.",
    });
    return;
  }

  const { displayName, email, username, password } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          displayName,
          email,
          username: username || null,
          passwordHash,
          status: "PENDING",
        },
      });

      const school = await tx.school.create({
        data: {
          name: schoolName,
          slug: schoolSlug,
          email,
          status: "PENDING",
        },
      });

      await tx.schoolMembership.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          role: "SCHOOL_ADMIN",
        },
      });

      await tx.auditLog.create({
        data: {
          schoolId: school.id,
          actorId: user.id,
          action: "SCHOOL_REGISTRATION_SUBMITTED",
          entityType: "School",
          entityId: school.id,
          details: {
            schoolSlug,
            approvalStatus: "PENDING",
          },
          ipAddress: req.ip,
        },
      });
    });

    res.status(201).json({
      message:
        "Registration submitted. Your account and school require ISS approval before login.",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        error: "That email, username, or school URL is already registered.",
      });
      return;
    }

    console.error("School registration failed.");
    res.status(500).json({
      error: "Unable to submit registration right now.",
    });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Enter your email or username and password.",
    });
    return;
  }

  const { identifier, password } = parsed.data;

  try {
    const normalizedIdentifier = identifier.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifier },
          { username: identifier },
        ],
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        passwordHash: true,
        status: true,
        platformRole: true,
        memberships: {
          where: {
            school: {
              status: "ACTIVE",
            },
          },
          select: {
            schoolId: true,
            role: true,
            school: {
              select: {
                name: true,
                slug: true,
                primaryColor: true,
                accentColor: true,
              },
            },
          },
        },
      },
    });

    const passwordMatches = user
      ? await verifyPassword(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches || user.status !== "ACTIVE") {
      res.status(401).json({
        error: "Invalid credentials or account not yet approved.",
      });
      return;
    }

    const accessToken = createAccessToken(user.id, user.email);

    res.json({
      accessToken,
      tokenType: "Bearer",
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        platformRole: user.platformRole,
        schools: user.memberships.map((membership) => ({
          id: membership.schoolId,
          role: membership.role,
          name: membership.school.name,
          slug: membership.school.slug,
          primaryColor: membership.school.primaryColor,
          accentColor: membership.school.accentColor,
        })),
      },
    });
  } catch {
    res.status(500).json({
      error: "Unable to sign in right now.",
    });
  }
});

export default router;
