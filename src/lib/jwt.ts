import * as jose from "jose";

const DEV_FALLBACK = "dev-only-jwt-secret-minimum-32-chars!!";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production");
    }
    return new TextEncoder().encode(DEV_FALLBACK);
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(userId: string): Promise<string> {
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAccessToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
