import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { category_id, question, answer } = body

    if (!category_id || typeof category_id !== 'string') {
      return NextResponse.json(
        { error: 'category_id is required and must be a string' },
        { status: 400 }
      )
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'question is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return NextResponse.json(
        { error: 'answer is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        {
          category_id,
          question: question.trim(),
          answer: answer.trim(),
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create flashcard', details: error.message },
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
