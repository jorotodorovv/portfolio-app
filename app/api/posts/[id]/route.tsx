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
            comments: includeComments,
        },
    });

    if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
}
