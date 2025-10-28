import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PlayPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, description')
    .order('name', { ascending: true })

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Play Mode</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold">Error loading categories</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Play Mode</h1>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No categories available</p>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Play Mode</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a category and mode to start practicing
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/play/${category.id}?mode=sequential`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Sequential Order
                </Link>
                <Link
                  href={`/play/${category.id}?mode=random`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Random Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
