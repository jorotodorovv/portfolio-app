import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface PostRequest {
    title: string;
    content: File;
    tags: string;
}

export async function GET(request: Request) {
    const posts = await prisma.post.findMany({
        include: {
            tags: true,
        },
    });

    return NextResponse.json({ posts });
}

export async function POST(request: Request) {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const tags = formData.get('tags') as string;
    const content = formData.get('content') as File;

    if (!content) {
        return NextResponse.json({ message: 'No content file provided' }, { status: 400 });
    }


    const fileContent = await new Promise<string>(async (resolve, reject) => {
        const fileBuffer = Buffer.from(await content.arrayBuffer());
        const fileText = fileBuffer.toString('utf-8');

        resolve(fileText);
    });

    const readTime = Math.ceil(fileContent.split(' ').length / 200);
    const excerpt = fileContent.substring(0, 100);

    // Create a new post object in the database
    const newPost = await prisma.post.create({
        data: {
            title,
            excerpt,
            content: fileContent,
            readTime,
            tags: {
                connectOrCreate: tags.split(',').map(tag => ({
                    where: { name: tag.trim() },
                    create: { name: tag.trim() }
                }))
            }
        }
    });

    return NextResponse.json({ message: 'Post created successfully', post: newPost });
}