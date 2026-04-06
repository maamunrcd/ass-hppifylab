import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/jwt";
import type { RegisterData, LoginData } from "@/types/auth";

export class AuthService {
  static async register(data: RegisterData) {
    const { firstName, lastName, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const token = await signAccessToken(user.id);

    return { user, token };
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const token = await signAccessToken(user.id);

    return { user, token };
  }
}
