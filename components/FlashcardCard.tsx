'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteFlashcardButton from './DeleteFlashcardButton'

type FlashcardCardProps = {
  flashcard: {
    id: string
    question: string
    answer: string
    created_at: string
  }
  categories: { id: string; name: string }[]
}

export default function FlashcardCard({ flashcard, categories }: FlashcardCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [question, setQuestion] = useState(flashcard.question)
  const [answer, setAnswer] = useState(flashcard.answer)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const body: Record<string, string> = { question, answer }
      if (categoryId) body.category_id = categoryId

      const response = await fetch(`/api/flashcards/${flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update flashcard')
      }

      setIsEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      {!isEditing ? (
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Q:</span>
              <p className="text-sm font-medium mt-1">{flashcard.question}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">A:</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{flashcard.answer}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Created {new Date(flashcard.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Edit
            </button>
            <DeleteFlashcardButton flashcardId={flashcard.id} />
          </div>
        </div>
      ) : (
        <div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mb-3">
              <p className="text-red-800 dark:text-red-200 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {categories.length > 0 && (
              <div>
                <label htmlFor={`edit-category-${flashcard.id}`} className="block text-xs font-medium mb-1">
                  Category (optional)
                </label>
                <select
                  id={`edit-category-${flashcard.id}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Keep current category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor={`edit-question-${flashcard.id}`} className="block text-xs font-medium mb-1">
                Question *
              </label>
              <textarea
                id={`edit-question-${flashcard.id}`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                rows={2}
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor={`edit-answer-${flashcard.id}`} className="block text-xs font-medium mb-1">
                Answer *
              </label>
              <textarea
                id={`edit-answer-${flashcard.id}`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                rows={2}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setCategoryId('')
                  setQuestion(flashcard.question)
                  setAnswer(flashcard.answer)
                  setError(null)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-xs font-medium py-1.5 px-3 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
