import { notFound } from 'next/navigation';

import BlogContent from './BlogContent';
import SocialShare from './SocialShare';
import CommentSection from './CommentSection';
import { PostEntity } from '@/server/posts';

export default function BlogArticle(
    { posts, userId, postUrl, onDelete }:
    { posts: PostEntity[], postUrl: string, userId: string, onDelete: (postId: string, refresh: boolean) => void }) {
    const selectedPost: PostEntity | undefined = posts.find(p => p.url === postUrl);

    if (!selectedPost) return notFound();

    return <article className="w-[100ch] mx-auto">
        <BlogContent post={selectedPost} userId={userId} onDelete={onDelete} />
        <SocialShare url={`${window.location.origin}/blog/${selectedPost.id}`} title={selectedPost.title} />
        <CommentSection postId={selectedPost.id} />
    </article>
}