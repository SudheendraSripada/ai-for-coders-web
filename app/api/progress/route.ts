import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Progress fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, task_id, code_solution, completed, score } = await request.json()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id,
        task_id: task_id || null,
        code_solution,
        completed: completed || false,
        score: score || null,
        attempts: 1,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id,task_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Progress save error:', error)
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      progress: data 
    })
  } catch (error) {
    console.error('Progress save error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
