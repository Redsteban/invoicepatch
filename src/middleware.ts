import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get user role from headers (we'll set this from localStorage via client-side)
  const userRole = request.headers.get('x-user-role') || request.cookies.get('user-role')?.value;

  // Define role-based route patterns
  const managerRoutes = ['/manager', '/admin'];
  const contractorRoutes = ['/contractor'];
  const publicRoutes = ['/', '/contact-sales', '/pricing'];

  // Check if current path matches any role-specific routes
  const isManagerRoute = managerRoutes.some(route => pathname.startsWith(route));
  const isContractorRoute = contractorRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no role is set and trying to access protected routes, redirect to home
  if (!userRole && (isManagerRoute || isContractorRoute)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based access control
  if (userRole === 'manager' && isContractorRoute) {
    // Manager trying to access contractor routes - redirect to unauthorized
    return NextResponse.redirect(new URL('/unauthorized?role=manager&attempted=contractor', request.url));
  }

  if (userRole === 'contractor' && isManagerRoute) {
    // Contractor trying to access manager routes - redirect to unauthorized
    return NextResponse.redirect(new URL('/unauthorized?role=contractor&attempted=manager', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 