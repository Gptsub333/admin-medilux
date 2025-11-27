// middleware.js (place in root directory)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Root path - redirect based on auth
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If not logged in and accessing protected route → login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and tries to access login/register → dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }



  return NextResponse.next();
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/providers/:path*',
    '/services/:path*',
    '/appointments/:path*',
    '/settings/:path*',
    '/users/:path*',
    '/logs/:path*',
    '/login',
    '/register'
  ],
};

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      * - api routes
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
//   ],
// };