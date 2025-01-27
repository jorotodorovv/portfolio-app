// components/BlogPostUploadModal.tsx
import { generateDescriptionWithAI, generateTagsWithAI } from '@/endpoints/generate'
import { createPost } from '@/endpoints/posts'
import { useState } from 'react'
import Loader from './Loader'

interface BlogPostUploadModalProps {
  isOpen: boolean
  userId: string | null
  onClose: () => void
}

export default function BlogPostUploadModal({ isOpen, userId, onClose }: BlogPostUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !userId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(() => true)

      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      const file = fileInput?.files?.[0]

      if (file) {
        const title = file.name
          .replace('.md', '')
          .replace(/[_-]+/g, ' ')
          .replace(/[^\w\s]/g, '')

        const reader = new FileReader()

        reader.onload = async (event) => {
          const content = event.target?.result as string

          const description: string = await generateDescriptionWithAI(content)
          const tags: string[] = await generateTagsWithAI(content)

          if (!userId) {
            throw new Error('User is not authenticated')
          }

          await createPost(
            {
              content,
              title,
              description,
              tags,
              userId,
            },
          )
        }

        reader.readAsText(file);
      }
    } catch (ex: unknown) {
      console.log(ex)
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 5000)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl mx-4">
        {isLoading ? <Loader /> :
          <>
            <h2 className="text-2xl font-bold mb-4">Create New Blog Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fileInput" className="block mb-2">
                  Upload Markdown File
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept=".md"
                  className="w-full p-2 bg-gray-800 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Post
                </button>
              </div>
            </form>
          </>
        }
      </div>
    </div>
  )
}