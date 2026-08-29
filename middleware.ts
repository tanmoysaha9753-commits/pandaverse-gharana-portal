import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;

  let role: string | null = null;

  if (accessToken && refreshToken) {
    try {
      const supabase = createServerSupabaseClient();
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .maybeSingle();

        role = profile?.role || null;
      }
    } catch {
      // Invalid session — let the request proceed to the page which will handle auth
    }
  }

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isPartnerRoute = path.startsWith('/partner');
  const isProtectedRoute = isAdminRoute || isPartnerRoute;
  const isAuthPage = path === '/login';

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/partner/dashboard', request.url));
  }

  if (isAuthPage && accessToken) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/partner/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)',
  ],
};
