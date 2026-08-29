import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Supabase stores session cookies using a project-specific name like:
  //   sb-{project-ref}-auth-token
  // Look for any cookie starting with "sb-" and ending in "-auth-token".
  const authCookieName = request.cookies
    .getAll()
    .map((c) => c.name)
    .find((name) => name.startsWith('sb-') && name.endsWith('-auth-token'));

  let role: string | null = null;
  let hasSession = !!authCookieName;

  if (authCookieName) {
    try {
      const cookieValue = request.cookies.get(authCookieName)?.value;
      if (cookieValue) {
        // Parse the chunked cookie format: "base64-chunk1 base64-chunk2 ..."
        const decoded = decodeURIComponent(cookieValue)
          .split(' ')
          .filter(Boolean)
          .map((part) => {
            try {
              return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        const sessionData = decoded[0];
        const accessToken = sessionData?.access_token;
        const refreshToken = sessionData?.refresh_token;

        if (accessToken && refreshToken) {
          const supabase = createServerSupabaseClient();
          const { data: clientData, error: sessionError } =
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

          if (!sessionError && clientData?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', clientData.user.id)
              .maybeSingle();

            role = profile?.role || null;
          }
        }
      }
    } catch {
      // Invalid session — let the request proceed; page-level checks will redirect
    }
  }

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isPartnerRoute = path.startsWith('/partner');
  const isProtectedRoute = isAdminRoute || isPartnerRoute;
  const isAuthPage = path === '/login' || path === '/signup';

  if (isProtectedRoute && !hasSession) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && role !== 'admin') {
    const url = new URL('/partner/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    const target = role === 'admin' ? '/admin' : '/partner/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)',
  ],
};