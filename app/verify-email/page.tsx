'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResend = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('No email found')

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: 'https://ai-for-coders-web-pi.vercel.app/auth/confirm',
        },
      })
      if (resendError) throw resendError
      setMessage('Confirmation email resent! Check your inbox.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600">Check your inbox for a confirmation link.</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="p-3 bg-green-100 text-green-700 rounded mb-4 text-sm">
              {message}
            </div>
          )}
          
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition mb-4"
          >
            {loading ? 'Sending...' : 'Resend Confirmation Email'}
          </button>
          
          <p className="text-sm text-gray-600 text-center">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
