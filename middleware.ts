/**
 * Next.js Middleware for Authentication
 * 
 * NOTE: Next.js 16 shows a deprecation warning suggesting "proxy" pattern.
 * However, middleware.ts is still the standard and fully supported approach.
 * The "proxy" pattern is experimental and not yet recommended for production.
 * 
 * This middleware:
 * - Protects routes that require authentication
 * - Redirects authenticated users away from auth pages
 * - Handles cookie-based session management (SSR-safe, Vercel-safe)
 * - Works with Supabase Auth using the @supabase/ssr package
 * 
 * The warning can be safely ignored until Next.js provides clear migration path.
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.delete({ name, ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const protectedPaths = ['/dashboard', '/explore']
  const authPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/email-password',
    '/auth/otp',
    '/auth/otp-verify',
    '/auth/magic-link',
    '/auth/confirm',
    '/auth/callback',
  ]
  const onboardingPath = '/auth/onboarding'

  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))
  const isAuthPath = authPaths.some((path) => req.nextUrl.pathname.startsWith(path))
  const isOnboardingPath = req.nextUrl.pathname.startsWith(onboardingPath)

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isProtectedPath && session) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user && !user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', req.url))
    }
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isOnboardingPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/explore/:path*',
    '/auth/login',
    '/auth/signup',
    '/auth/email-password',
    '/auth/otp',
    '/auth/otp-verify',
    '/auth/magic-link',
    '/auth/confirm',
    '/auth/callback',
    '/auth/onboarding',
    '/verify-email',
    '/welcome',
  ],
}
