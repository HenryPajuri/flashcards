'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Flashcard = {
  id: string
  question: string
  answer: string
  category_id: string
}

export default function PlayGamePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categoryId = params.categoryId as string
  const mode = searchParams.get('mode') || 'sequential'

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    async function loadFlashcards() {
      try {
        const response = await fetch(`/api/flashcards?category_id=${categoryId}`)
        if (!response.ok) throw new Error('Failed to load flashcards')

        const data = await response.json()

        if (!data || data.length === 0) {
          setError('No flashcards found in this category')
          setLoading(false)
          return
        }

        if (mode === 'random') {
          const shuffled = [...data].sort(() => Math.random() - 0.5)
          setFlashcards(shuffled)
        } else {
          setFlashcards(data)
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    loadFlashcards()
  }, [categoryId, mode])

  const currentCard = flashcards[currentIndex]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const correct = userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
    }
  }

  const saveAttempt = async (finalScore: number) => {
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: categoryId,
          mode: mode,
          correct_answers: finalScore,
          total_questions: flashcards.length,
        }),
      })
    } catch (err) {
      console.error('Failed to save attempt:', err)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= flashcards.length) {
      const finalScore = isCorrect ? score + 1 : score
      saveAttempt(finalScore)
      setCompleted(true)
    } else {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowResult(false)
      setIsCorrect(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading flashcards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
          <Link
            href="/play"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to play mode
          </Link>
        </div>
      </div>
    )
  }

  if (completed) {
    const percentage = Math.round((score / flashcards.length) * 100)

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {percentage === 100 ? 'Perfect!' : percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
            </h1>
            <p className="text-6xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              {percentage}%
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              You got {score} out of {flashcards.length} correct
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/play"
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Categories
              </Link>
              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setScore(0)
                  setCompleted(false)
                  setUserAnswer('')
                  setShowResult(false)
                  if (mode === 'random') {
                    setFlashcards([...flashcards].sort(() => Math.random() - 0.5))
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/play"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← Back to categories
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {flashcards.length} | Score: {score}/{currentIndex + (showResult ? 1 : 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question:</p>
            <h2 className="text-2xl font-semibold">{currentCard.question}</h2>
          </div>

          {!showResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium mb-2">
                  Your Answer:
                </label>
                <input
                  id="answer"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Type your answer..."
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`font-semibold mb-2 ${
                  isCorrect
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                {!isCorrect && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your answer:</p>
                    <p className="text-red-600 dark:text-red-300 mb-2">{userAnswer}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correct answer:</p>
                    <p className="text-green-600 dark:text-green-300">{currentCard.answer}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {currentIndex + 1 >= flashcards.length ? 'Finish' : 'Next Card'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
