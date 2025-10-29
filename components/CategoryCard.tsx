'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteCategoryButton from './DeleteCategoryButton'

type CategoryCardProps = {
  category: {
    id: string
    name: string
    description: string | null
    created_at: string
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update category')
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
        <div className="flex justify-between items-start">
          <div className="flex-1">
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
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Edit
            </button>
            <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
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
            <div>
              <label htmlFor={`edit-name-${category.id}`} className="block text-xs font-medium mb-1">
                Name *
              </label>
              <input
                id={`edit-name-${category.id}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor={`edit-desc-${category.id}`} className="block text-xs font-medium mb-1">
                Description
              </label>
              <textarea
                id={`edit-desc-${category.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setName(category.name)
                  setDescription(category.description || '')
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
