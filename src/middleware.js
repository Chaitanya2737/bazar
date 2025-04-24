import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request) {
  const token = await getToken({ req: request, secret });
  const pathname = request.nextUrl.pathname;

  // Allow public access to signin pages
  if (pathname === '/signin' || pathname === '/admin/signin') {
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/signin', request.url));
    }

    if (!token.isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/signin', request.url));
    }
  }

  // User routes
  if (pathname.startsWith('/user')) {
    if (!token || token.role !== 'user') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (!token.isAuthenticated) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'], // Protect these routes
};
