import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { generateDescription, generateTags } from '@/client/ai';
import { PostEntity, PostRequestData } from '@/server/posts';
import { createPost, deletePost } from '@/client/posts';
import { useReducer } from 'react';

export enum PostActionType {
    ADD = 'ADD_POST',
    DELETE = 'DELETE_POST'
}

export interface PostAction {
    type: PostActionType,
    post: PostEntity
};

const postReducer = (state: PostEntity[], action: PostAction): PostEntity[] => {
    switch (action.type) {
        case PostActionType.ADD:
            return [...state, action.post];
        case PostActionType.DELETE:
            return [...state.filter(post => post.id !== action.post.id)]
        default:
            return state;
    }
};

export const useBlog = (initialPosts: PostEntity[], session: Session | null) => {
    const [posts, postDispatch] = useReducer(postReducer, initialPosts);
    const router = useRouter();

    const userId = session?.user?.id || '';

    const handleDelete = async (postId: string, refresh: boolean) => {
        if (!postId) return;

        if (confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await deletePost(postId, userId);

                if (response.post)
                    await postDispatch({ type: PostActionType.DELETE, post: response.post });

                if (refresh) router.push('/blog');
            } catch (error: any) {
                console.error("Error deleting post:", error);
                alert("Failed to delete post: " + error.message); // Display error to user
            }
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

                    const description = await generateDescription(content);
                    const tags = await generateTags(content);

                    const url = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');

                    const postData: PostRequestData = {
                        content,
                        title,
                        url,
                        description: description?.replace(/\s\.\s*/g, '. '),
                        tags,
                        userId,
                    };

                    try {
                        const response = await createPost(postData);

                        if (response.post)
                            await postDispatch({ type: PostActionType.ADD, post: response.post });

                        onLoading(false);
                        onClose();
                    } catch (error: any) {
                        console.error("Error creating post:", error);
                        alert("Failed to create post: " + error.message);
                        onLoading(false);
                    }
                };

                reader.readAsText(file);
            }
        } catch (ex: any) {
            console.error(ex);
            alert("An unexpected error occurred: " + ex.message); // Display error to user
            onLoading(false);
        }
    };

    return { handleDelete, handleUpload, posts };
};