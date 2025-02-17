import { PostResponse } from '@/client/posts';
import { createPost, PostRequestData } from '@/server/posts';
import { NextResponse } from 'next/server'

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