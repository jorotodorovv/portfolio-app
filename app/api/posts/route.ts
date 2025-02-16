import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PostRequestData } from '@/endpoints/posts';

const prisma = new PrismaClient()

export async function GET() {
    const posts = await prisma.post.findMany({
        include: {
            tags: true,
            user: true,
        },
    });

    return NextResponse.json({ posts });
}

export async function POST(request: Request) {
    const { content, title, url, description, tags, userId }: PostRequestData = await request.json();

    if (!content) {
        return NextResponse.json({ message: 'No content file provided' }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    const readTime = Math.ceil(content.split(' ').length / 200);

    const newPost = await prisma.post.create({
        data: {
            title,
            excerpt: description,
            url,
            content,
            readTime,
            user: {
                connect: { id: userId }, // Connect the post to the user
            },
            tags: {
                connectOrCreate: tags.map(tag => ({
                    where: { name: tag.trim() },
                    create: { name: tag.trim() }
                }))
            }
        }
    });

    return NextResponse.json({ message: 'Post created successfully', post: newPost });
}