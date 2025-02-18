import { FetchEndpoints, FetchMethods, request } from "@/lib/api";

export const generateTags = async (content: string): Promise<string[]> => {
    try {
        const endpoint = [FetchEndpoints.GENERATE, 'tags'].join('/');

        const data: { tags: string[] } = await request(endpoint, {
            method: FetchMethods.POST,
            body: { content },
        });       
        return data.tags;
    } catch (error) {
        console.error('Failed to generate tags with AI', error);
        return [];
    }
}

export const generateDescription = async (content: string): Promise<string> => {
    try {
        const endpoint = [FetchEndpoints.GENERATE, 'description'].join('/');

        const data: { description: string } = await request(endpoint, {
            method: FetchMethods.POST,
            body: { content },
        });
        return data.description;
    } catch (error) {
        console.error('Failed to generate description with AI', error);
        return "";
    }
}