'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session) {
          // User logged in - redirect to dashboard unless on specific pages
          if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/welcome')) {
            router.push('/dashboard')
            router.refresh()
          }
        } else if (event === 'SIGNED_OUT') {
          // User logged out - redirect to login
          if (!pathname.startsWith('/auth') && pathname !== '/') {
            router.push('/auth/login')
            router.refresh()
          }
        } else if (event === 'USER_UPDATED' && session) {
          // User session updated
          if (session.user.email_confirmed_at && pathname === '/verify-email') {
            router.push('/welcome')
            router.refresh()
          }
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, pathname])

  return <>{children}</>
}
