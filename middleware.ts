import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // if (request.nextUrl.pathname === "/") {
  //   if (token) {
  //     return NextResponse.redirect(new URL("/update_profile", request.url));
  //   }
  // }
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ["/update_profile", "/dashboard/:path*"],
};
