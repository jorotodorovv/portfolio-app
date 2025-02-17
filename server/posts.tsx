import { Comment, PrismaClient, Tag } from '@prisma/client'

const prisma = new PrismaClient()

export interface PostRequestData {
    content: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    userId: string | undefined;
}

export interface PostEntity {
    id: string;
    title: string;
    url: string;
    excerpt: string;
    content: string;
    date: Date;
    readTime: number;
    tags?: Tag[];
    comments?: Comment[];
    user?: {
        id: string;
        username: string | null;
    };
}
export async function getPosts(): Promise<PostEntity[]> {
    const posts: PostEntity[] = await prisma.post.findMany({
        include: {
            tags: true,
            user: true,
            comments: true,
        },
    });

    return posts;
}

export async function getPost(id: string) : Promise<PostEntity> {
    try {
        const post = await prisma.post.findUnique({
            where: { url: id },
            include: {
                tags: true,
                user: true,
                comments: true,
            },
        });

        if (!post) {
            throw new Error('Post not found');
        }

        return post;
    } catch (error: any) {
        console.error('Error getting post:', error);
        throw new Error('Failed to get post: ' + error.message);
    }
}

export async function createPost(postData: PostRequestData): Promise<PostEntity> {
    const { content, title, url, description, tags, userId } = postData;

    if (!content) {
        throw new Error('No content file provided');
    }

    if (!userId) {
        throw new Error('User is not authenticated');
    }

    const readTime = Math.ceil(content.split(' ').length / 200);

    try {
        const newPost: PostEntity = await prisma.post.create({
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
            },
            include: {
                tags: true,
                user: true,
            },
        });

        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
        throw new Error('Failed to create post');
    }
}

export async function deletePost(id: string, userId: string) : Promise<PostEntity> {
    try {
        const post = await prisma.post.findUnique({
            where: { id: id },
            select: { userId: true }
        });

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userId !== userId) {
            throw new Error('User is not authorized to delete this post');
        }

        // First delete all related comments
        await prisma.comment.deleteMany({
            where: { postId: id },
        });

        // Then delete the post
        const deletedPost = await prisma.post.delete({
            where: { id: id },
        });

        return deletedPost;
    }
    catch (error: any) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post: ' + error.message);
    }
}