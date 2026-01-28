import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/otp-verify?email=${encodeURIComponent(email)}`
      }
    })

    if (error) {
      console.error('OTP send error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to send OTP' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
