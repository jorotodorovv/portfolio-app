'use client'

import { useState, useEffect } from 'react'
import Transition from './Transition'
import { formatDistanceToNow, FormatDistanceToNowOptions, Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'

export interface Comment {
  id: string
  author: string
  content: string
  createdAt: Date
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ initialComments, postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')
  const [locale, setLocale] = useState<Locale | null>(enUS)

  useEffect(() => {
    if(!navigator || !navigator.language) return;

    const lang = navigator.language.replace('-', '');
    loadLocale(lang);
  }, []);

  const loadLocale = async (lang : string) => {
    try {
      const localeModule = await import(`date-fns/locale`)
      const locale = localeModule[lang as keyof typeof localeModule] as Locale;
      setLocale(locale)
    } catch (error) {
      console.error(`Failed to load locale for ${lang}:`, error);
    }
  }

  const submitComment = async (comment: Comment) => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author: comment.author, content: comment.content, postId }),
    });

    if (response.ok) {
      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]); // Update the comments state with the new comment
      setNewComment('');
      setAuthor('');
    } else {
      console.error('Failed to add comment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || author.trim() === '') return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: newComment.trim(),
      createdAt: new Date(),
    };

    await submitComment(comment); // Call the new function
  };

  const options: FormatDistanceToNowOptions = {
    addSuffix: true,
    locale: locale || enUS
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <Transition key={comment.id}>
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{comment.author}</span>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(comment.createdAt, options)}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        </Transition>
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

