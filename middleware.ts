import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { verifyAuthToken } from '@/lib/token';

const AUTH_PATHS = ['/login', '/register', '/reset-password'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = !!(token && verifyAuthToken(token));
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    if (!isAuthenticated && pathname.startsWith('/api/leads')) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    if (!isAuthenticated && pathname.startsWith('/api/stages')) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    if (!isAuthenticated && pathname.startsWith('/api/profile')) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/profile'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register', '/reset-password/:path*', '/api/:path*']
};
