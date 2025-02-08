import { put } from "@vercel/blob";
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return new NextResponse(JSON.stringify({ error: "No image file provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        const { url } = await put(`/images/${imageFile.name}`, imageFile, {
            access: 'public',
        });

        return new NextResponse(JSON.stringify({ imageUrl: url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Error uploading to Vercel Blob:", error);
        return new NextResponse(JSON.stringify({ error: `Failed to upload image: ${error.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}