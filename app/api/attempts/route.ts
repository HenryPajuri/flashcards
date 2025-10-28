import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { category_id, mode, correct_answers, total_questions } = body

    if (!category_id || typeof category_id !== 'string') {
      return NextResponse.json(
        { error: 'category_id is required and must be a string' },
        { status: 400 }
      )
    }

    if (!mode || typeof mode !== 'string') {
      return NextResponse.json(
        { error: 'mode is required and must be a string' },
        { status: 400 }
      )
    }

    if (typeof correct_answers !== 'number' || correct_answers < 0) {
      return NextResponse.json(
        { error: 'correct_answers is required and must be a non-negative number' },
        { status: 400 }
      )
    }

    if (typeof total_questions !== 'number' || total_questions <= 0) {
      return NextResponse.json(
        { error: 'total_questions is required and must be a positive number' },
        { status: 400 }
      )
    }

    const score_percentage = (correct_answers / total_questions) * 100

    const { data, error } = await supabase
      .from('attempts')
      .insert([
        {
          category_id,
          mode,
          correct_answers,
          total_questions,
          score_percentage,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save attempt', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id')

    let query = supabase
      .from('attempts')
      .select('*')
      .order('completed_at', { ascending: false })

    if (category_id) {
      query = query.eq('category_id', category_id)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch attempts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
