import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ExperienceLevel } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { experience_level, learning_goals } = await request.json()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        experience_level: experience_level as ExperienceLevel,
        learning_goals: learning_goals || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Onboarding update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
