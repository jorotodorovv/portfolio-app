import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Markdown from 'react-markdown'

import CodeSnippet from '@/components/CodeSnippet'
import CommentSection from '@/components/CommentSection'
import SocialShare from '@/components/SocialShare'

import { Suspense } from 'react';
import { Post } from '@/components/BlogList'

async function fetchPost(id: string) {
  const baseUrl = `http://localhost:3000`;
  const response = await fetch(`${baseUrl}/api/posts/${id}`);

  if (!response.ok) {
      throw new Error('Failed to fetch post');
  }

  const post: Post = await response.json();

  return post;
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post: Post = await fetchPost(params.id);

  if (!post) {
    notFound()
  }

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
          {post.content}
        </Markdown>

        <div className="mt-8">
          {post.tags.map((tag) => (
            <span key={tag.id} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
              {tag.name}
            </span>
          ))}
        </div>
        <SocialShare url={`https://localhost:3000/blog/${post.id}`} title={post.title} />
        <CommentSection postId={post.id} initialComments={initialComments} />
      </article>
    </Suspense>
  )
}

