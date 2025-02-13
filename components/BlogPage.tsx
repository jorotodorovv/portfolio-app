'use client'

import useSWR from 'swr';

import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { generateDescriptionWithAI, generateTagsWithAI } from '@/endpoints/generate'
import { createPost } from '@/endpoints/posts'
import { deletePost } from '@/endpoints/posts';

import Loader from './Loader';

import BlogList, { Post } from './BlogList';
import BlogContent from './BlogContent';
import { BlogView } from './BlogView';

import SocialShare from './SocialShare';
import CommentSection from './CommentSection';
import { Session } from 'next-auth';
import { fetchData } from '@/endpoints/core';

interface PostResponse {
    posts: Post[];
}

const BlogPage = ({ currentView, session, postUrl }: { currentView: BlogView, session: Session | null, postUrl?: string }) => {
    const { data, error, mutate } = useSWR<PostResponse>('posts', fetchData);
    const { data: sessionData } = useSession();
    const router = useRouter();

    if (error) return <div>Failed to load</div>;
    if (!data || !data.posts) return <Loader />;

    session = session ?? sessionData;

    const userId = session?.user?.id || '';

    let selectedPost: Post | null = null;

    if (postUrl) {
        selectedPost = data.posts.find(p => p.url === postUrl) || null;
    }

    const handleDelete = (postId: string, refresh: boolean) => {
        if (!postId) return;

        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(postId, () => {
                mutate();
                if (refresh) router.push('/blog')
            });
        }
    };

    const handleUpload = async (
        e: React.FormEvent,
        onLoading: (isLoading: boolean) => void,
        onClose: () => void) => {
        try {
            e.preventDefault()
            onLoading(true);

            if (!userId) {
                throw new Error('User is not authenticated')
            }

            const fileInput = document.getElementById('fileInput') as HTMLInputElement
            const file = fileInput?.files?.[0]

            if (file) {
                const title = file.name
                    .replace('.md', '')
                    .replace(/[_-]+/g, ' ');

                const reader = new FileReader()

                reader.onload = async (event) => {
                    const content = event.target?.result as string

                    const description: string = await generateDescriptionWithAI(content);
                    const tags: string[] = await generateTagsWithAI(content);

                    const url = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');

                    await createPost(
                        {
                            content,
                            title,
                            url,
                            description: description?.replace(/\s\.\s*/g, '. '),
                            tags,
                            userId,
                        },
                        () => mutate()
                    )
                }

                reader.readAsText(file);
            }
        } catch (ex: unknown) {
            console.log(ex)
        } finally {
            setTimeout(() => {
                onLoading(false)
                onClose();
            }, 5000)
        }
    };


    switch (currentView) {
        case BlogView.LIST:
            return <BlogList
                posts={data.posts}
                onUpload={handleUpload}
                onDelete={handleDelete}
                userId={userId} />;
        case BlogView.CONTENT:
            return selectedPost ? (
                <article className="prose prose-invert mx-auto">
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