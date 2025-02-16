import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const url = new URL(request.url);
    const comments = url.searchParams.get('comments') === 'true';

    const post = await prisma.post.findUnique({
        where: { url: id },
        include: {
            tags: true,
            user: true,
            comments,
        },
    });

    if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ posts: [post] });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { userId }: { userId: string } = await request.json();

    if (!userId) {
        return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    const { id } = params;

    try {
        const post = await prisma.post.findUnique({
            where: { id: id },
            select: { userId: true }
        });

        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        if (post.userId !== userId) {
            return NextResponse.json({ message: 'User is not authorized to delete this post' }, { status: 403 });
        }

        // First delete all related comments
        await prisma.comment.deleteMany({
            where: { postId: id },
        });

        // Then delete the post
        const deletedPost = await prisma.post.delete({
            where: { id: id },
        });

        return NextResponse.json(deletedPost, { status: 200 });
    }
    catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { message: 'Error deleting post: ' + (error as Error).message },
            { status: 500 }
        );
    }
}