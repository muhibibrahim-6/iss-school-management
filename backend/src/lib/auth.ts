
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters."
    );
  }

  return secret;
};

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function createAccessToken(
  userId: string,
  email: string
): string {
  return jwt.sign(
    { email },
    getJwtSecret(),
    {
      subject: userId,
      expiresIn: "15m",
      issuer: "iss-school-management",
      audience: "iss-school-users",
    }
  );
}

export function verifyAccessToken(
  token: string
): JwtPayload {
  const result = jwt.verify(token, getJwtSecret(), {
    issuer: "iss-school-management",
    audience: "iss-school-users",
  });

  if (typeof result === "string" || !result.sub) {
    throw new Error("Invalid access token.");
  }

  return result;
}
