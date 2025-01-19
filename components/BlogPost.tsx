import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface BlogPostProps {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: number
  tags: string[]
}

export default function BlogPost({ id, title, excerpt, date, readTime, tags }: BlogPostProps) {
  return (
    <article className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <Link href={`/blog/${id}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-gray-300">{title}</h2>
      </Link>
      <p className="text-gray-400 mb-4">{excerpt}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
        <span>{readTime} min read</span>
      </div>
      <div className="mt-4">
        {tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

