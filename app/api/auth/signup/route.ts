import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://ai-for-coders-web-pi.vercel.app/welcome',
      },
    })

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create account' },
        { status: 400 }
      )
    }

    // Don't create profile here - let the callback handle it after email verification
    // The user needs to verify their email first

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your account before signing in.',
      user: data.user
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
