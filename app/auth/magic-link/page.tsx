'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function MagicLinkPage() {
  const router = useRouter()
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
          emailRedirectTo: 'https://ai-for-coders-web-pi.vercel.app/dashboard',
        },
      })

      if (otpError) {
        setError(otpError.message)
      } else {
        setMessage('Magic link sent! Check your email.')
        setSent(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">Check Your Email</h1>
          <p className="text-gray-600 mb-6">A magic link has been sent to {email}. Click it to login.</p>
          <button onClick={() => setSent(false)} className="text-blue-600">
            Send another link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login with Magic Link</h1>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
        {message && <div className="p-3 bg-green-100 text-green-700 rounded mb-4">{message}</div>}

        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          <a href="/auth/login" className="text-blue-600">
            Use password login instead
          </a>
        </p>
      </div>
    </div>
  )
}
