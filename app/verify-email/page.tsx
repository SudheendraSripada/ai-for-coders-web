'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResendEmail = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        setError('Unable to get email address')
        setLoading(false)
        return
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: 'https://ai-for-coders-web-pi.vercel.app/welcome',
        },
      })

      if (resendError) {
        setError(resendError.message)
      } else {
        setMessage('Confirmation email resent! Check your inbox.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>

        <p className="text-gray-600 mb-6">Check your inbox for a confirmation link. Click it to verify your email address.</p>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
        {message && <div className="p-3 bg-green-100 text-green-700 rounded mb-4">{message}</div>}

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 mb-4"
        >
          {loading ? 'Sending...' : 'Resend Confirmation Email'}
        </button>

        <p className="text-sm text-gray-600">
          <a href="/auth/login" className="text-blue-600">
            Back to login
          </a>
        </p>
      </div>
    </div>
  )
}
