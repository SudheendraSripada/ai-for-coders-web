import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const languageSlug = searchParams.get('language')

    if (!languageSlug) {
      return NextResponse.json(
        { error: 'Language slug is required' },
        { status: 400 }
      )
    }

    const { data: language, error: langError } = await supabase
      .from('languages')
      .select('id')
      .eq('slug', languageSlug)
      .single()

    if (langError || !language) {
      return NextResponse.json(
        { error: 'Language not found' },
        { status: 404 }
      )
    }

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('language_id', language.id)
      .order('order_index')

    if (error) {
      console.error('Courses fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      language: { ...language, slug: languageSlug },
      courses 
    })
  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
