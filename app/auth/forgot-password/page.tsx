'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://ai-for-coders-web-pi.vercel.app/auth/reset-password',
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setMessage('Password reset link sent! Check your email.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
        {message && <div className="p-3 bg-green-100 text-green-700 rounded mb-4">{message}</div>}

        <form onSubmit={handleForgotPassword} className="space-y-4">
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Remember your password?{' '}
          <a href="/auth/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
