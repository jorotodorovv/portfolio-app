import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const comments = await prisma.comment.findMany({
            where: { postId: id },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}