'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import posts from '../../content/posts.json'

export default function AdminPanel() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      setIsLoading(true)
      setTimeout(() => {
        router.push('/admin/login')
      }, 600) // Adjust the delay time as needed (300ms here)
    },
  })

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-t-4 border-transparent rounded-full bg-gradient-to-r from-blue-700 to-blue-900"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const content = event.target?.result as string;

        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content, tags, fileName: file.name }),
        })

        if (response.ok) {
          var result = await response.json();

          console.log(result.message)
          
          setTitle('')
          setContent('')
          setTags('')

          router.push('/blog')
        } else {
          console.error('Failed to create post')
        }
      }

      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
        <div>
          <label htmlFor="fileInput" className="block mb-2">Upload Markdown File</label>
          <input
            type="file"
            id="fileInput"
            accept=".md"
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Post
        </button>
      </form>
    </div>
  )
}

