import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

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

  // Protect admin UI routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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

  // Protect admin API routes (except /api/admin/auth/login)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth/login') {
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
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
