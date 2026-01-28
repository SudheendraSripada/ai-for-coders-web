import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })

    if (error) {
      console.error('OTP verify error:', error)
      return NextResponse.json(
        { error: error.message || 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session created' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: data.user
    })

    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return response
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
