import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name')

    if (error) {
      console.error('Languages fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch languages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ languages: data })
  } catch (error) {
    console.error('Languages fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
