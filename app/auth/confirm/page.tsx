'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const code = searchParams.get('code')

        if (!code) {
          const supabase = createClient()
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session?.user.email_confirmed_at) {
            router.push('/welcome')
          } else {
            setError('No confirmation code found')
            setLoading(false)
          }
          return
        }

        const supabase = createClient()
        const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

        if (authError) {
          setError(authError.message)
          setLoading(false)
          return
        }

        router.push('/welcome')
      } catch (err: any) {
        setError(err.message || 'Confirmation failed')
        setLoading(false)
      }
    }

    handleConfirmation()
  }, [searchParams, router])

  if (loading) return <div className="p-8 text-center">Confirming email...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  return null
}
