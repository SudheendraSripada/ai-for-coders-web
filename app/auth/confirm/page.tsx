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
        const code = searchParams.get('code')
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        const supabase = createClient()

        // Format A: ?code=XXXX (email confirmation)
        if (code) {
          console.log('Exchanging code for session')
          const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
          if (authError) throw authError
          
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
          
          router.push('/welcome')
          return
        }

        // Format B: ?token_hash=XXXX&type=signup (OTP/Magic link)
        if (tokenHash && type === 'signup') {
          console.log('Verifying OTP with token_hash')
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'signup',
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
          
          router.push('/welcome')
          return
        }

        // Format C: Magic link with email type
        if (tokenHash && type === 'magiclink') {
          console.log('Verifying magic link')
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'magiclink',
          })
          if (verifyError) throw verifyError
          router.push('/welcome')
          return
        }

        // No valid params - check if already authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.email_confirmed_at) {
          router.push('/welcome')
        } else {
          setError('Invalid confirmation link or already used')
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Confirmation error:', err)
        setError(err.message || 'Confirmation failed')
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
