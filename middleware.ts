import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ["/update_profile", "/dashboard/:path*"],
};
