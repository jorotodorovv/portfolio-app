'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loader from '@/components/Loader'

export default function AdminPanel() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      setIsLoading(true)
      setTimeout(() => {
        router.push('/admin/login')
      }, 600) // Adjust the delay time as needed (300ms here)
    },
  })

  if (status === "loading" || isLoading) {
    return <Loader />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append('content', file)

      const title = file.name.replace('.md', '').replace(/[_-]+/g, ' ').replace(/[^\w\s]/g, '');

      const reader = new FileReader()
      reader.onload = async (event) => {
        const content = event.target?.result as string

        const description = await generateDescriptionWithAI(content);
        const tags = await generateTagsWithAI(content);

        formData.append('title', title)
        formData.append('description', description)
        formData.append('tags', tags.join(', '))

        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          console.log(result.message)

          fileInput.value = ''
          router.push('/blog')
        } else {
          console.error('Failed to create post')
        }
      }
      reader.readAsText(file)
    }
  }

  const generateTagsWithAI = async (content: string) => {
    const response = await fetch('/api/generate/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const data = await response.json();

      return data.tags;
    } else {
      console.error('Failed to generate tags with AI');
      return [];
    }
  }

  const generateDescriptionWithAI = async (content: string) => {
    const response = await fetch('/api/generate/description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const data = await response.json();

      return data.tags;
    } else {
      console.error('Failed to generate description with AI');
      return [];
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fileInput" className="block mb-2">Upload Markdown File</label>
          <input
            type="file"
            id="fileInput"
            accept=".md"
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Post
        </button>
      </form>
    </div>
  )
}

