'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function ConfirmPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        const supabase = createClient()

        // Email confirmation links from Supabase come with token_hash parameter
        // NEVER use exchangeCodeForSession() for email confirmations - that's ONLY for OAuth flows
        
        // Handle email confirmation with token_hash (standard Supabase email links)
        if (tokenHash && type) {
          console.log('Verifying email with token_hash, type:', type)
          
          // Use verifyOtp for email confirmations (works cross-device)
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          })
          
          if (verifyError) throw verifyError
          
          // Create user profile if needed
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: existingProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            if (!existingProfile) {
              await supabase
                .from('user_profiles')
                .insert({
                  id: user.id,
                  email: user.email!,
                  full_name: user.user_metadata?.full_name || null,
                  experience_level: null,
                  learning_goals: null
                })
            }
          }
          
          // Don't manually redirect - let AuthProvider handle navigation
          setLoading(false)
          return
        }

        // No token_hash - check if user is already authenticated (email already verified)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.email_confirmed_at) {
          console.log('Email already confirmed, redirecting to welcome')
          router.push('/welcome')
        } else {
          setError('Invalid or expired confirmation link. Please request a new confirmation email.')
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Confirmation error:', err)
        setError(err.message || 'Email confirmation failed. Please try again or contact support.')
        setLoading(false)
      }
    }

    handleConfirmation()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming email...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Confirmation Failed</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ConfirmPageContent />
    </Suspense>
  )
}
