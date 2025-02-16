import useSWR from 'swr';

import { useRouter } from 'next/navigation';

import { fetchData, FetchEndpoints } from '@/endpoints/core';
import { deletePost, createPost } from '@/endpoints/posts';
import { generateDescriptionWithAI, generateTagsWithAI } from '@/endpoints/generate';
import { Session } from 'next-auth';

export const useBlog = (session: Session | null) => {
    const { mutate } = useSWR(FetchEndpoints.POSTS, fetchData);

    const router = useRouter();

    const userId = session?.user?.id || '';

    const handleDelete = (postId: string, refresh: boolean) => {
        if (!postId) return;

        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(postId, userId, () => {
                mutate();
                if (refresh) router.push('/blog');
            });
        }
    };

    const handleUpload = async (
        e: React.FormEvent,
        onLoading: (isLoading: boolean) => void,
        onClose: () => void
    ) => {
        try {
            e.preventDefault();
            onLoading(true);

            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            const file = fileInput?.files?.[0];

            if (file) {
                const title = file.name
                    .replace('.md', '')
                    .replace(/[_-]+/g, ' ');

                const reader = new FileReader();

                reader.onload = async (event) => {
                    const content = event.target?.result as string

                    const description = await generateDescriptionWithAI(content);
                    const tags = await generateTagsWithAI(content);

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
                        () => {
                            mutate().then(() => {
                                onLoading(false);
                                onClose();
                            });
                        }
                    );
                };

                reader.readAsText(file);
            }
        } catch (ex) {
            console.error(ex);
        }
    };

    return { handleDelete, handleUpload };
};