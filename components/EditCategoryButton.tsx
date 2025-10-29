'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EditCategoryButtonProps = {
  categoryId: string
  categoryName: string
  categoryDescription: string | null
}

export default function EditCategoryButton({ categoryId, categoryName, categoryDescription }: EditCategoryButtonProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(categoryName)
  const [description, setDescription] = useState(categoryDescription || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
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

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
      >
        Edit
      </button>
    )
  }

  return (
    <div className="col-span-full mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mb-3">
          <p className="text-red-800 dark:text-red-200 text-xs">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor={`edit-name-${categoryId}`} className="block text-xs font-medium mb-1">
            Name *
          </label>
          <input
            id={`edit-name-${categoryId}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={`edit-desc-${categoryId}`} className="block text-xs font-medium mb-1">
            Description
          </label>
          <textarea
            id={`edit-desc-${categoryId}`}
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
              setName(categoryName)
              setDescription(categoryDescription || '')
              setError(null)
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-xs font-medium py-1.5 px-3 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
