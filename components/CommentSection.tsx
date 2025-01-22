'use client'

import { useState } from 'react'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() === '' || author.trim() === '') return

    const comment: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment('')
    setAuthor('')

    // Here you would typically send the new comment to your backend API
    console.log('New comment:', comment)
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{comment.author}</span>
            <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p>{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="w-full p-2 bg-gray-800 rounded mb-2"
          required
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 bg-gray-800 rounded mb-2"
          rows={3}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Post Comment
        </button>
      </form>
    </div>
  )
}

