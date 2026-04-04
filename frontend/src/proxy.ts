import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const validRoutes = [
        '/',
        '/home',
        '/account/dashboard',
        '/account/profile',
        '/generate',
        '/account/login',
        '/account/register',
    ];

    if (!validRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/account/dashboard' || pathname === '/account/profile') {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!$|api|_next/static|_next/image|favicon.ico).*)',
};