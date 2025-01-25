import { Post } from "@/components/BlogList";

export async function fetchPosts(url : string) {
    const baseUrl = `${window.location.origin}`;
    const response = await fetch(`${baseUrl}/${url}`);
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const result = await response.json();

    return result.posts;
}

export async function fetchPost(id: string) {
    const baseUrl = `${window.location.origin}`;
    const response = await fetch(`${baseUrl}/api/posts/${id}?includeComments=true`);

    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const post: Post = await response.json();

    return post;
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
