import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that do NOT require authentication
const PUBLIC_PATHS = ['/login', '/signup', '/', '/_next'];

// Paths that require admin role
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Get the access_token from cookies
  const accessToken = request.cookies.get('sb-access-token')?.value
    || request.cookies.get('access_token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  // For protected paths, continue to the server component which will verify the session
  // Role-based routing is handled by the page components themselves
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
