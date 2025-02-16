'use client'

import useSWR from 'swr';

import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

import Loader from './Loader';

import BlogList, { Post } from './BlogList';
import BlogContent from './BlogContent';
import { BlogView } from './BlogView';

import SocialShare from './SocialShare';
import CommentSection from './CommentSection';

import { fetchData, FetchEndpoints } from '@/endpoints/core';
import { useBlog } from '@/hooks/useBlog';

interface PostResponse {
    posts: Post[];
}

const BlogPage = ({ currentView, session, postUrl }: { currentView: BlogView, session: Session | null, postUrl?: string }) => {
    const { data, error } = useSWR<PostResponse>(FetchEndpoints.POSTS, fetchData);

    const { handleDelete, handleUpload } = useBlog(session);


    if (error) return <div>Failed to load</div>;
    if (!data || !data.posts) return <Loader />;

    const userId = session?.user?.id || '';

    let selectedPost: Post | null = null;

    if (postUrl) {
        selectedPost = data.posts.find(p => p.url === postUrl) || null;
    }

    switch (currentView) {
        case BlogView.LIST:
            return <BlogList
                posts={data.posts}
                onUpload={handleUpload}
                onDelete={handleDelete}
                userId={userId} />;
        case BlogView.CONTENT:
            return selectedPost ? (
                <article className="prose w-[100ch] mx-auto">
                    <BlogContent post={selectedPost} userId={userId} onDelete={handleDelete} />
                    <SocialShare url={`${window.location.origin}/blog/${selectedPost.id}`} title={selectedPost.title} />
                    <CommentSection postId={selectedPost.id} />
                </article>
            ) : notFound();
        default:
            return notFound();
    };
}

export default BlogPage;