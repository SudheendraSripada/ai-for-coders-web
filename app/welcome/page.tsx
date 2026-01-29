'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function WelcomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome! 🎉</h1>
        <p className="text-gray-600 mb-2">Your email has been confirmed:</p>
        <p className="font-semibold mb-6">{user?.email}</p>

        <button onClick={() => router.push('/dashboard')} className="w-full px-4 py-2 bg-green-600 text-white rounded">
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
