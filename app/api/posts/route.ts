import { PostResponse } from '@/client/posts';
import { createPost, PostRequestData } from '@/server/posts';
import { NextResponse } from 'next/server'

/**
 * Handles HTTP POST requests to create a new post.
 *
 * This function extracts post data from the incoming request's JSON body, including content,
 * title, URL, description, tags, and user ID, which conform to the PostRequestData type. It
 * then calls the createPost function to create a new post.
 *
 * On successful creation, a JSON response containing the new post is returned with a 201 status code.
 * If an error occurs during the process, the error is logged and a JSON response with an error message
 * and a 500 status code is returned.
 *
 * @param request - The incoming HTTP request containing JSON data for the new post.
 * @returns A promise that resolves to a NextResponse containing either the created post data on success
 *          or an error message on failure.
 *
 * @example
 * // Example usage:
 * const response = await POST(request);
 * if (response.status === 201) {
 *   const responseData = await response.json();
 *   console.log('Post created:', responseData.post);
 * } else {
 *   console.error('Failed to create post');
 * }
 */
export async function POST(request: Request): Promise<NextResponse<PostResponse>> {
    const { content, title, url, description, tags, userId }: PostRequestData = await request.json();

    try {
        const post = await createPost({ content, title, url, description, tags, userId });

        return NextResponse.json(
            { post },
            { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        
        return NextResponse.json(
            { message: 'Error creating post: ' + (error as Error).message },
            { status: 500 }
        );
    }
}