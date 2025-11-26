import { NextResponse } from "next/server"

export function middleware(request) {
  const session = request.cookies.get("medilux_session")
  const isAuthenticated = session?.value === "authenticated"
  const isLoginPage = request.nextUrl.pathname === "/login"

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon).*)"],
}
