import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', parseInt(courseId))
      .order('order_index')

    if (error) {
      console.error('Lessons fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch lessons' },
        { status: 500 }
      )
    }

    const lessonsWithTasks = await Promise.all(
      lessons.map(async (lesson) => {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('lesson_id', lesson.id)
          .order('order_index')
        
        return { ...lesson, tasks: tasks || [] }
      })
    )

    return NextResponse.json({ lessons: lessonsWithTasks })
  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
