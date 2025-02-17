import { PostEntity, PostRequestData } from "@/server/posts";
import { fetchData, FetchEndpoints, FetchMethods } from "./core";

interface UserRequestData {
    userId: string;
}

export interface PostResponse {
    post?: PostEntity,
    message?: string,
}

export const createPost = (content: PostRequestData, callback?: () => void) =>
    fetchData<PostResponse, PostRequestData>(
        FetchEndpoints.POSTS,
        { method: FetchMethods.POST, body: content, callback });

export const deletePost = (postId: string, userId: string, callback?: () => void) =>
    fetchData<PostResponse, UserRequestData>(
        FetchEndpoints.POSTS,
        { method: FetchMethods.DELETE, body: { userId }, query: [postId], callback });