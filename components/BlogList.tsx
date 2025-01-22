'use client'

import { useState } from 'react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'

import BlogPost from '@/components/BlogPost'

const POSTS_PER_PAGE = 3

export interface Tag {
    id: string;
    name: string;
}

export interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: Date;
    readTime: number;
    tags: Tag[];
}

export interface BlogListProps {
    posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
    const searchParams : ReadonlyURLSearchParams | null = useSearchParams();

    const pageParam = searchParams?.get('page')
    const searchParam = searchParams?.get('search')
    const tagParam = searchParams?.get('tag')

    const [search, setSearch] = useState(searchParam || '')
    const [currentPage, setCurrentPage] = useState(parseInt(pageParam || '1', 10))
    const [selectedTag, setSelectedTag] = useState(tagParam || '')

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase())

        const matchesTag = selectedTag ? post.tags.some(t => t.name === selectedTag) : true

        return matchesSearch && matchesTag
    })

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const displayedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    const allTags : Tag[] = Array.from(new Set(posts.flatMap(post => post.tags)))

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    const handleTagClick = (tag: Tag) => {
        setSelectedTag(tag.name === selectedTag ? '' : tag.name)
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
                        key={tag.id}
                        onClick={() => handleTagClick(tag)}
                        className={`inline-block px-3 py-1 mr-2 mb-2 text-sm font-semibold rounded-full 
                            ${selectedTag === tag.name ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
                            }`}
                    >
                        {tag.name}
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