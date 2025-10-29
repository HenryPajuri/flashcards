import { createClient } from '@/lib/supabase/server'
import AddCategoryForm from '@/components/AddCategoryForm'
import AddFlashcardForm from '@/components/AddFlashcardForm'
import CategoryCard from '@/components/CategoryCard'
import FlashcardCard from '@/components/FlashcardCard'

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
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No categories yet</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Flashcards</h2>
              <AddFlashcardForm categories={categories || []} />
            </div>
            {flashcardsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-semibold">Error loading flashcards</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{flashcardsError.message}</p>
              </div>
            ) : flashcards && flashcards.length > 0 ? (
              <div className="space-y-3">
                {flashcards.map((card) => (
                  <FlashcardCard key={card.id} flashcard={card} categories={categories || []} />
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
