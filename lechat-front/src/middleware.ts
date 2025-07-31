// lechat-front/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('lechat-role')?.value;

  const pathname = request.nextUrl.pathname;

  const protectedRoutes: Record<string, string> = {
    '/chat': 'agent',
    '/admin': 'admin',
    '/superuser': 'superuser',
  };

  // Vérifie si la route demandée est protégée
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const expectedRole = protectedRoutes[route];
      if (role !== expectedRole) {
      return NextResponse.redirect(new URL('/403', request.url));
      }
    }
  }

  return NextResponse.next();
}
