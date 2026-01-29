'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const code = searchParams.get('code')
        const token = searchParams.get('token')
        const type = searchParams.get('type')
        const email = searchParams.get('email')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('Auth callback error:', error, errorDescription)
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed')
          return
        }

        // Handle OTP verification
        if (token && email && type === 'otp') {
          console.log('Verifying OTP:', token)
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
          })
          
          if (verifyError) {
            console.error('OTP verification error:', verifyError)
            setStatus('error')
            setMessage(`OTP verification failed: ${verifyError.message}`)
            return
          }

          if (data.user && data.session) {
            console.log('OTP verification successful:', data.user.email)
            
            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (!existingProfile) {
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  email: data.user.email!,
                  full_name: data.user.user_metadata?.full_name || null,
                  experience_level: null,
                  learning_goals: null
                })

              if (profileError) {
                console.error('Profile creation error:', profileError)
              }
            }

            setStatus('success')
            setMessage('OTP verified successfully! Redirecting...')
            
            setTimeout(() => {
              router.push('/welcome')
            }, 2000)
            return
          }
        }

        // Handle email verification via code
        if (code) {
          console.log('Exchanging code for session:', code)
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            setStatus('error')
            setMessage(`Verification failed: ${exchangeError.message}`)
            return
          }

          if (data.user && data.session) {
            console.log('User verified successfully:', data.user.email)
            
            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (!existingProfile) {
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  email: data.user.email!,
                  full_name: data.user.user_metadata?.full_name || null,
                  experience_level: null,
                  learning_goals: null
                })

              if (profileError) {
                console.error('Profile creation error:', profileError)
              }
            }

            setStatus('success')
            setMessage('Email verified successfully! Redirecting...')
            
            setTimeout(() => {
              router.push('/welcome')
            }, 2000)
            return
          }
        }

        // If no code/token, check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.email_confirmed_at) {
          console.log('User already authenticated:', user.email)
          router.push('/welcome')
          return
        }

        // No verification data found - redirect to OTP page
        console.log('No verification data found, redirecting to OTP')
        router.push('/auth/otp')
        
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during verification')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            {status === 'loading' && <Shield className="h-6 w-6 text-indigo-600 animate-pulse" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === 'error' && <AlertCircle className="h-6 w-6 text-red-600" />}
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message || 'Please wait while we verify your email address.'}
          </p>
        </div>

        {status === 'error' && (
          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push('/auth/otp')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try OTP Login
            </button>
            <button
              onClick={() => router.push('/auth/email-password')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up with Email & Password
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}