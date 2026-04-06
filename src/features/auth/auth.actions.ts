"use server";

import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/schemas";

export async function registerAction(raw: unknown) {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false as const, error: msg };
  }

  try {
    const { token } = await AuthService.register(parsed.data);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return { success: false as const, error: message };
  }
}

export async function loginAction(raw: unknown) {
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false as const, error: msg };
  }

  try {
    const { token } = await AuthService.login(parsed.data);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return { success: false as const, error: message };
  }
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
