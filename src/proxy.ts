import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

const TOKEN_COOKIE = "token";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isFeedPage = pathname === "/feed" || pathname === "/";

  if (isFeedPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyAccessToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete(TOKEN_COOKIE);
      return res;
    }
  }

  if (isAuthPage && token) {
    const payload = await verifyAccessToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed", "/login", "/register", "/"],
};
