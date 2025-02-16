'use client'

import useSWR from 'swr';

import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

import Loader from './Loader';

import BlogList, { Post } from './BlogList';
import { BlogView } from './BlogView';

import { fetchData, FetchEndpoints } from '@/endpoints/core';
import { useBlog } from '@/hooks/useBlog';
import BlogArticle from './BlogArticle';

interface PostResponse {
    posts: Post[];
}

const BlogPage = ({ currentView, session, postUrl }: { currentView: BlogView, session: Session | null, postUrl?: string }) => {
    const endpoint = currentView === BlogView.LIST ?
        FetchEndpoints.POSTS :
        [FetchEndpoints.POSTS, postUrl].join('/');

    const { data, error } = useSWR<PostResponse>(endpoint, fetchData);
    const { handleDelete, handleUpload } = useBlog(session);

    if (error) return <div>Failed to load</div>;
    if (!data || !data.posts) return <Loader />;

    const userId = session?.user?.id || '';

    switch (currentView) {
        case BlogView.LIST:
            return <BlogList
                posts={data.posts}
                onUpload={handleUpload}
                onDelete={handleDelete}
                userId={userId} />;
        case BlogView.CONTENT:
            return <BlogArticle
                posts={data.posts}
                postUrl={postUrl || ''}
                userId={userId}
                onDelete={handleDelete} />
        default:
            return notFound();
    };
}

export default BlogPage;