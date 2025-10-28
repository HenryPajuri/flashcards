import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Attempt = {
  id: string
  category_id: string
  mode: string
  correct_answers: number
  total_questions: number
  score_percentage: number
  completed_at: string
}

type Category = {
  id: string
  name: string
}

type CategoryStats = {
  category: Category
  totalAttempts: number
  averageScore: number
  bestScore: number
  recentAttempts: Attempt[]
}

export default async function StatsPage() {
  const supabase = await createClient()

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  const { data: attempts, error: attemptsError } = await supabase
    .from('attempts')
    .select('*')
    .order('completed_at', { ascending: false })

  if (categoriesError || attemptsError) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Statistics</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold">Error loading statistics</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              {categoriesError?.message || attemptsError?.message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4 inline-block"
            >
              ← Back to home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Statistics</h1>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No statistics yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Play some flashcards to see your statistics here
            </p>
            <Link
              href="/play"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start Playing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryStatsMap = new Map<string, CategoryStats>()

  categories?.forEach((category) => {
    const categoryAttempts = attempts.filter((a) => a.category_id === category.id)

    if (categoryAttempts.length > 0) {
      const totalAttempts = categoryAttempts.length
      const averageScore =
        categoryAttempts.reduce((sum, a) => sum + a.score_percentage, 0) / totalAttempts
      const bestScore = Math.max(...categoryAttempts.map((a) => a.score_percentage))
      const recentAttempts = categoryAttempts.slice(0, 5)

      categoryStatsMap.set(category.id, {
        category,
        totalAttempts,
        averageScore,
        bestScore,
        recentAttempts,
      })
    }
  })

  const statsArray = Array.from(categoryStatsMap.values())

  const overallStats = {
    totalAttempts: attempts.length,
    averageScore: attempts.reduce((sum, a) => sum + a.score_percentage, 0) / attempts.length,
    bestScore: Math.max(...attempts.map((a) => a.score_percentage)),
    totalCategories: statsArray.length,
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Attempts</p>
            <p className="text-3xl font-bold">
              {overallStats.totalAttempts}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Score</p>
            <p className="text-3xl font-bold">
              {Math.round(overallStats.averageScore)}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Best Score</p>
            <p className="text-3xl font-bold">
              {Math.round(overallStats.bestScore)}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Categories Played</p>
            <p className="text-3xl font-bold">
              {overallStats.totalCategories}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {statsArray.map((stats) => (
            <div
              key={stats.category.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">{stats.category.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                    <p className="text-xl font-semibold">
                      {Math.round(stats.averageScore)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Best</p>
                    <p className="text-xl font-semibold">
                      {Math.round(stats.bestScore)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recent Attempts:
                </p>
                {stats.recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded p-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {attempt.correct_answers}/{attempt.total_questions}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {attempt.mode}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold">
                        {Math.round(attempt.score_percentage)}%
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(attempt.completed_at).toLocaleDateString()} {new Date(attempt.completed_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
