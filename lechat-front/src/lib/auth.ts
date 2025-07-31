// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';

export function requireAuth(req: NextRequest, allowedRoles: string[] = []) {
  const session = req.cookies.get('session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const sessionData = JSON.parse(Buffer.from(session, 'base64').toString());

    if (allowedRoles.length && !allowedRoles.includes(sessionData.role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return sessionData;
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
