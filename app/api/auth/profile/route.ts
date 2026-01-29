import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ExperienceLevel } from '@/lib/types'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, experience_level, learning_goals, preferred_language, bio } = body

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) updateData.full_name = full_name
    if (experience_level !== undefined) updateData.experience_level = experience_level as ExperienceLevel
    if (learning_goals !== undefined) updateData.learning_goals = learning_goals
    if (preferred_language !== undefined) updateData.preferred_language = preferred_language
    if (bio !== undefined) updateData.bio = bio

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      user: data 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
