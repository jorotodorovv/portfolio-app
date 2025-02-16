import { fetchData, FetchMethods } from "./core";

export interface PostRequestData {
    content: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    userId: string | undefined;
}

export const createPost = (content: PostRequestData, callback?: () => void) =>
    fetchData('posts', { method: FetchMethods.POST, body: content, callback });

export const deletePost = (postId: string, userId: string, callback?: () => void) =>
    fetchData('posts', { method: FetchMethods.DELETE, body: { userId }, query: [postId], callback });