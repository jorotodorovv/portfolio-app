import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Markdown from 'react-markdown'
import fs from 'fs'
import path from 'path'

import CodeSnippet from '@/components/CodeSnippet'
import CommentSection from '@/components/CommentSection'
import SocialShare from '@/components/SocialShare'

import posts from '../../../content/posts.json'

import { Suspense } from 'react';

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id)

  if (!post) {
    notFound()
  }

  const contentPath = path.join(process.cwd(), post.content)
  const postContent = fs.readFileSync(contentPath, 'utf-8') // Read and cache the markdown file

  // In a real application, you would fetch comments from a database
  const initialComments = [
    { id: '1', author: 'John Doe', content: 'Great article!', createdAt: '2023-07-10T12:00:00Z' },
    { id: '2', author: 'Jane Smith', content: 'Thanks for sharing this information.', createdAt: '2023-07-11T09:30:00Z' },
  ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <article className="prose prose-invert mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
          <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
          <span>{post.readTime} min read</span>
        </div>
        <Markdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <CodeSnippet
                  code={String(children).replace(/\n$/, '')}
                  language={match[1]}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {postContent}
        </Markdown>

        <div className="mt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
        <SocialShare url={`https://yourdomain.com/blog/${post.id}`} title={post.title} />
        <CommentSection postId={post.id} initialComments={initialComments} />
      </article>
    </Suspense>
  )
}

