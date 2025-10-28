import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { category_id, question, answer } = body

    if (category_id && typeof category_id !== 'string') {
      return NextResponse.json(
        { error: 'category_id must be a string' },
        { status: 400 }
      )
    }

    if (question !== undefined && (typeof question !== 'string' || question.trim().length === 0)) {
      return NextResponse.json(
        { error: 'question must be a non-empty string' },
        { status: 400 }
      )
    }

    if (answer !== undefined && (typeof answer !== 'string' || answer.trim().length === 0)) {
      return NextResponse.json(
        { error: 'answer must be a non-empty string' },
        { status: 400 }
      )
    }

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    }

    if (category_id) updateData.category_id = category_id
    if (question) updateData.question = question.trim()
    if (answer) updateData.answer = answer.trim()

    const { data, error } = await supabase
      .from('flashcards')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Flashcard not found' },
          { status: 404 }
        )
      }
      if (error.code === '23503') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update flashcard', details: error.message },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete flashcard', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Flashcard deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
