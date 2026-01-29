'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function MagicLinkPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://ai-for-coders-web-pi.vercel.app/auth/confirm',
        },
      })

      if (otpError) throw otpError
      setSent(true)
      setMessage('Magic link sent! Check your email.')
      // DO NOT manually redirect - let AuthProvider handle it
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Check your email</h1>
            <p className="text-gray-600 mb-2">Magic link sent to:</p>
            <p className="font-semibold text-gray-900 mb-4">{email}</p>
            <p className="text-sm text-gray-500">Click the link in the email to log in</p>
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Send another link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Login with Magic Link</h1>
        <p className="text-gray-600 mb-6">Enter your email and we'll send you a link to log in</p>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        
        <p className="text-sm text-gray-600 mt-4 text-center">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Use password login instead
          </Link>
        </p>
      </div>
    </div>
  )
}
