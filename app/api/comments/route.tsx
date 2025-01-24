import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { postId: string } }) {
    const { postId } = params;

    const comments = await prisma.comment.findMany({
        where: { postId },
    });

    return NextResponse.json(comments, { status: 201 });
}

export async function POST(request: Request) {
    const { author, content, postId } = await request.json();

    const newComment = await prisma.comment.create({
        data: {
            author,
            content,
            post: {
                connect: { id: postId },
            },
        },
    });

    return NextResponse.json(newComment, { status: 201 });
}