// Auth is handled server-side in admin layout and API routes.
// This file is intentionally empty to avoid Edge Runtime issues with Prisma.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
