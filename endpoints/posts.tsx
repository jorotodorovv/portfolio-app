import { Post } from "@/components/BlogList";

export interface PostRequestData {
    content: string;
    title: string;
    description: string;
    tags: string[];
    userId: string;
}

export async function fetchPosts(url: string) {
    const response = await fetch(`${window.location.origin}/${url}`);

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const result = await response.json();

    return result.posts;
}

export async function fetchPost(id: string) {
    const response = await fetch(`${window.location.origin}/api/posts/${id}?includeComments=true`);

    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const post: Post = await response.json();

    return post;
}

export async function createPost(content: PostRequestData, callback?: () => void) {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
    })

    if (!response.ok) {
        throw new Error('Failed to create post')
    }

    const result = await response.json()
    if (callback) callback();

    return result;
}

export async function deletePost(postId: string, callback?: () => void) {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        if (callback) callback();
    } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the post.');
    }
};
