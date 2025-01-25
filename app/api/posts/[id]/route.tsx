import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const url = new URL(request.url);
    const includeComments = url.searchParams.get('includeComments') === 'true';

    const post = await prisma.post.findUnique({
        where: { id: id },
        include: {
            tags: true,
            user: true,
            comments: includeComments,
        },
    });

    if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // First delete all related comments
        await prisma.comment.deleteMany({
            where: { postId: id },
        });

        // Then delete the post
        const deletedPost = await prisma.post.delete({
            where: { id: id },
        });

        return NextResponse.json(deletedPost, { status: 200 });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { message: 'Error deleting post: ' + (error as Error).message },
            { status: 500 }
        );
    }
}