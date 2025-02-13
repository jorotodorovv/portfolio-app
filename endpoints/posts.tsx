import { fetchData, FetchMethods } from "./core";

export interface PostRequestData {
    content: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    userId: string;
}

export const createPost = (content: PostRequestData, callback?: () => void) =>
    fetchData('posts', { method: FetchMethods.POST, body: content, callback });

export const deletePost = (id: string, callback?: () => void) =>
    fetchData('posts', { method: FetchMethods.DELETE, query: [id], callback });