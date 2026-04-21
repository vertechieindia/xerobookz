import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/super-admin',
  '/company-admin',
  '/employee',
  '/contract-team',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/super-admin-accessportal',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = request.cookies.get('xerobookz_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (isProtectedRoute && !token) {
    // Redirect to appropriate login page based on route
    if (pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/super-admin-accessportal', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify token is valid (basic check - full verification happens in API)
  if (isProtectedRoute && token) {
    // Token exists, allow through (API will verify)
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
