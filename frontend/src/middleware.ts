import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const rawToken = request.cookies.get('accessToken')?.value;
  const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' && rawToken.trim() !== '' ? rawToken : null;
  const { pathname } = request.nextUrl;

  console.log(`[DEBUG Middleware] Path: ${pathname} | Valid Token exists: ${!!token}`);

  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/termos',
    '/politica-privacidade',
    '/lgpd',
    '/planos',
    '/contato',
    '/recursos',
    '/demo',
    '/help',
  ];
  const isRoot = pathname === '/';
  const isPublicRoute = isRoot || publicRoutes.some((route) => pathname.startsWith(route));

  // Usuário não autenticado tentando acessar rotas privadas
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    console.log(`[DEBUG Middleware] Redirecionando não autenticado para /login de ${pathname}`);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário autenticado tentando acessar login/registro/esqueci a senha
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (token && isAuthRoute) {
    const dashboardUrl = new URL('/dashboard', request.url);
    console.log(`[DEBUG Middleware] Redirecionando autenticado para /dashboard de ${pathname}`);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
