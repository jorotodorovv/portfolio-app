'use client'

import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

import Loader from './Loader';

import BlogList from './BlogList';
import { BlogView } from './BlogView';

import { useBlog } from '@/hooks/useBlog';
import BlogArticle from './BlogArticle';
import { PostEntity } from '@/server/posts';

const BlogPage = ({ currentView, initialPosts, session, postUrl }:
    { currentView: BlogView, initialPosts: PostEntity[], session: Session | null, postUrl?: string }) => {
    const { handleDelete, handleUpload, posts } = useBlog(initialPosts, session);

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