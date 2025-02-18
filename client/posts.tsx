import { PostEntity, PostRequestData } from "@/server/posts";
import { request, FetchEndpoints, FetchMethods } from "@/lib/api";

interface UserRequestData {
    userId: string;
}

export interface PostResponse {
    post?: PostEntity,
    message?: string,
}

export const createPost = async (content: PostRequestData, callback?: () => void) =>
    await request<PostResponse, PostRequestData>(
        FetchEndpoints.POSTS,
        { method: FetchMethods.POST, body: content, callback });

export const deletePost = async (postId: string, userId: string, callback?: () => void) =>
    await request<PostResponse, UserRequestData>(
        FetchEndpoints.POSTS,
        { method: FetchMethods.DELETE, body: { userId }, query: [postId], callback });