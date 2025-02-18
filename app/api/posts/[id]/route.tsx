import { PostResponse } from '@/client/posts';
import { deletePost } from '@/server/posts';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<PostResponse>> {
    const { userId }: { userId: string } = await request.json();

    if (!userId) {
        return NextResponse.json(
            { message: 'User is not authenticated' },
            { status: 401 });
    }

    const { id } = params;

    try {
        const post = await deletePost(id, userId);

        return NextResponse.json(
            { post },
            { status: 200 });
    }
    catch (error) {
        console.error('Delete error:', error);

        return NextResponse.json(
            { message: 'Error deleting post: ' + (error as Error).message },
            { status: 500 },
        );
    }
}