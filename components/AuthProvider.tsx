'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes - this is the SINGLE source of truth for navigation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, 'on path:', pathname)
        
        if (event === 'SIGNED_IN' && session) {
          // User successfully signed in
          // Don't redirect if on auth confirmation pages (they handle their own flow)
          if (pathname.startsWith('/auth/confirm')) {
            // Let confirm page handle redirect to /welcome
            return
          }
          
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            if (pathname !== '/verify-email') {
              router.push('/verify-email')
              router.refresh()
            }
            return
          }
          
          // Email confirmed - redirect to dashboard unless already on protected pages
          if (!pathname.startsWith('/dashboard') && 
              !pathname.startsWith('/welcome') && 
              !pathname.startsWith('/explore')) {
            router.push('/dashboard')
            router.refresh()
          }
        } else if (event === 'SIGNED_OUT') {
          // User logged out - redirect to login unless already on public pages
          if (!pathname.startsWith('/auth') && pathname !== '/') {
            router.push('/auth/login')
            router.refresh()
          }
        } else if (event === 'USER_UPDATED' && session) {
          // User data or session updated
          if (session.user.email_confirmed_at) {
            // Email just got confirmed
            if (pathname === '/verify-email') {
              router.push('/welcome')
              router.refresh()
            } else if (pathname === '/auth/confirm') {
              router.push('/welcome')
              router.refresh()
            }
          }
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Silent token refresh - just update router
          router.refresh()
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, pathname])

  return <>{children}</>
}
