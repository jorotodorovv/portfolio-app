'use client'

import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'

import BlogPost from '@/components/BlogPost'
import BlogPostUploadModal from '@/components/BlogPostUploadModal'

import { Comment } from './CommentSection'
import Transition from './Transition'

const POSTS_PER_PAGE = 10

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
    comments: Comment[];
    user: {
        id: string;
        username: string;
    };
}

export interface BlogListProps {
    posts: Post[];
    onDelete: (postId: string, refresh: boolean) => void;
    onUpload: (
        e: React.FormEvent, 
        onLoading: (isLoading: boolean) => void,
        onClose : () => void) => void;
    userId: string;
}

export default function BlogList({ posts, onDelete, onUpload, userId }: BlogListProps) {
    const searchParams: ReadonlyURLSearchParams | null = useSearchParams();

    const pageParam = searchParams?.get('page')
    const searchParam = searchParams?.get('search')
    const tagParam = searchParams?.get('tag')

    const [search, setSearch] = useState(searchParam || '')
    const [currentPage, setCurrentPage] = useState(parseInt(pageParam || '1', 10))
    const [selectedTag, setSelectedTag] = useState(tagParam || '')
    const [isUploadModalOpen, setUploadModalOpen] = useState(false)

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase())

        const matchesTag = selectedTag ? post.tags.some(t => t.name === selectedTag) : true

        return matchesSearch && matchesTag
    })

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const displayedPosts = filteredPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(
            (currentPage - 1) * POSTS_PER_PAGE,
            currentPage * POSTS_PER_PAGE
        )

    const allTags: Tag[] = Array.from(
        new Map(posts.flatMap(post => post.tags.map(tag => [tag.id, tag]))).values()
    );

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
            {userId && (
                <div className="flex justify-end mb-8">
                    <button
                        type="button"
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Upload Post
                    </button>
                </div>
            )}

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
                <Transition key={post.id} id={post.id}>
                    <div key={post.id} className="relative group">
                        <BlogPost {...post} />
                        {post.user.id === userId && (
                            <button
                                onClick={() => onDelete(post.id, false)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                        text-red-500 hover:text-red-700 transition-opacity"
                                aria-label="Delete post"
                            >
                                <FaTrash size={16} />
                            </button>
                        )}
                    </div>
                </Transition>
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
            <BlogPostUploadModal
                isOpen={isUploadModalOpen}
                userId={userId}
                onSubmit={onUpload}
                onClose={() => setUploadModalOpen(false)}
            />
        </div>
    )
}