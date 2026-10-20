
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ISS_OWNER_EMAIL?.trim().toLowerCase();
  const username = process.env.ISS_OWNER_USERNAME?.trim();
  const displayName = process.env.ISS_OWNER_NAME?.trim();
  const password = process.env.ISS_OWNER_PASSWORD;

  if (!email || !username || !displayName || !password) {
    throw new Error(
      "ISS_OWNER_EMAIL, ISS_OWNER_USERNAME, ISS_OWNER_NAME, and ISS_OWNER_PASSWORD are required."
    );
  }

  if (password.length < 16) {
    throw new Error(
      "ISS_OWNER_PASSWORD must contain at least 16 characters."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      platformRole: true,
    },
  });

  if (existing) {
    if (existing.platformRole === "ISS_OWNER") {
      console.log("An ISS Owner account already exists. No changes made.");
      return;
    }

    throw new Error(
      "The supplied email or username already belongs to another account. No role was changed."
    );
  }

  await prisma.user.create({
    data: {
      email,
      username,
      displayName,
      passwordHash,
      status: "ACTIVE",
      platformRole: "ISS_OWNER",
      emailVerified: true,
    },
  });

  console.log("ISS Owner account created successfully.");
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Owner setup failed."
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
