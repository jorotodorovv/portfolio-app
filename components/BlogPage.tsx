'use client'

import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

import Loader from './Loader';

import BlogList, { Post } from './BlogList';
import { BlogView } from './BlogView';

import { useBlog } from '@/hooks/useBlog';
import BlogArticle from './BlogArticle';
import { useCallback, useEffect, useState } from 'react';
import { fetchData, FetchEndpoints } from '@/endpoints/core';

interface PostResponse {
    posts: Post[];
}

const BlogPage = ({ currentView, initialPosts, session, postUrl }:
    { currentView: BlogView, initialPosts: Post[], session: Session | null, postUrl?: string }) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    const refreshPosts = useCallback(async () => {
        try {
            const response: PostResponse = await fetchData(FetchEndpoints.POSTS);
            setPosts(response.posts);
        } catch (error) {
            console.error("Error refreshing posts:", error);
        }
    }, []);

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const { handleDelete, handleUpload } = useBlog(session, refreshPosts);

    if (!initialPosts) return <Loader />;

    const userId = session?.user?.id || '';

    switch (currentView) {
        case BlogView.LIST:
            return <BlogList
                posts={posts}
                onUpload={handleUpload}
                onDelete={handleDelete}
                userId={userId} />;
        case BlogView.CONTENT:
            return <BlogArticle
                posts={posts}
                postUrl={postUrl || ''}
                userId={userId}
                onDelete={handleDelete} />
        default:
            return notFound();
    };
}

export default BlogPage;