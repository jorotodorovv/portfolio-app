import { generateOutput, ModelType } from '@/lib/ai';
import { NextResponse } from 'next/server';

interface Keyword {
    word: string; // Adjust the type based on your actual data structure
}

export async function POST(request: Request) {
    const { content } = await request.json();

    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    try {
        // Call the AI service to get tags
        const result : Keyword[] = await generateOutput(content, ModelType.KEYWORD);
        const tags = result.map(t => t.word);
        
        return NextResponse.json({ tags });
    } catch (error) {
        console.error('Error generating tags:', error);
        return NextResponse.json({ error: 'Failed to generate tags' }, { status: 500 });
    }
}
