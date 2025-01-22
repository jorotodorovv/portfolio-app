'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogPost from '@/components/BlogPost'
import posts from '../content/posts.json'

const POSTS_PER_PAGE = 3

export default function BlogList() {
    const searchParams = useSearchParams()
    const pageParam = searchParams.get('page')
    const searchParam = searchParams.get('search')
    const tagParam = searchParams.get('tag')

    const [search, setSearch] = useState(searchParam || '')
    const [currentPage, setCurrentPage] = useState(parseInt(pageParam || '1', 10))
    const [selectedTag, setSelectedTag] = useState(tagParam || '')

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase())

        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true

        return matchesSearch && matchesTag
    })

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const displayedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag === selectedTag ? '' : tag)
        setCurrentPage(1)
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

            <form onSubmit={handleSearch} className="mb-8">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full p-2 bg-gray-800 rounded"
                />
            </form>

            <div className="mb-8">
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`inline-block px-3 py-1 mr-2 mb-2 text-sm font-semibold rounded-full ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {displayedPosts.map((post) => (
                <BlogPost key={post.id} {...post} />
            ))}

            <div className="mt-8 flex justify-between">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

