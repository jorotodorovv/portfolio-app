import { generateOutput, ModelType } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { content } = await request.json();

    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    try {
        // Call the AI service to get tags
        const result = await generateOutput(content, ModelType.SUMMARY);
        const description = result[0]?.summary_text || 'No summary available';

        return NextResponse.json({ description });
    } catch (error) {
        console.error('Error generating description:', error);
        return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
    }
}
