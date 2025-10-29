import { createClient } from '@/lib/supabase/server'
import AddCategoryForm from '@/components/AddCategoryForm'

export default async function Home() {
  const supabase = await createClient()

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: flashcards, error: flashcardsError } = await supabase
    .from('flashcards')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Flashcards App</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your flashcards and categories
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Categories</h2>
              <AddCategoryForm />
            </div>
            {categoriesError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-semibold">Error loading categories</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{categoriesError.message}</p>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Created {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No categories yet</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>
            {flashcardsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-semibold">Error loading flashcards</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{flashcardsError.message}</p>
              </div>
            ) : flashcards && flashcards.length > 0 ? (
              <div className="space-y-3">
                {flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Q:</span>
                      <p className="text-sm font-medium mt-1">{card.question}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">A:</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{card.answer}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Created {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No flashcards yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
