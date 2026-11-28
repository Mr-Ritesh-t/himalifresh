import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Fast pattern to instantly drop malicious scanner probes with 0 CPU overhead
const SCANNER_PROBE_REGEX =
  /(^\/\.(?!well-known)|^\/(?:laravel|wp|backend|instance|\.aws|\.git)\/|\.env|\.yml$|\.yaml$|\.bak$|\.properties$|\.sql$|\/actuator|\/docker-compose|\/terraform|\/credentials\.json|\/serviceAccountKey\.json|\/secrets\.json|\/awsconfiguration\.json|\/amplifyconfiguration\.json|\/appsettings\.json)/i;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }
  return new TextEncoder().encode(
    secret || 'himali_fresh_local_dev_only_secret_key'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Instantly reject automated vulnerability scanners without loading Next.js SSR
  if (SCANNER_PROBE_REGEX.test(pathname)) {
    return new Response(null, { status: 404 });
  }

  // 2. Protect admin UI routes (except public admin auth pages like /admin/login, /admin/forgot-password)
  const isPublicAdminUi =
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/forgot-password') ||
    pathname.startsWith('/admin/reset-password');

  if (pathname.startsWith('/admin') && !isPublicAdminUi) {
    const token = request.cookies.get('himali_admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      if (payload.isUser === true || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
        throw new Error('Forbidden');
      }
      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('himali_admin_token');
      return response;
    }
  }

  // 3. Protect admin API routes (except public admin auth endpoints)
  const isPublicAdminApi =
    pathname === '/api/admin/auth/login' ||
    pathname.startsWith('/api/admin/auth/otp');

  if (pathname.startsWith('/api/admin') && !isPublicAdminApi) {
    const token = request.cookies.get('himali_admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      if (payload.isUser === true || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Unauthorized or expired session' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all requests except static chunks, images, and public assets
     */
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
};
