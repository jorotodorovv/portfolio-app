import { fetchData, FetchMethods } from "./core";

export const generateTagsWithAI = async (content: string): Promise<string[]> => {
    try {
        const data: { tags: string[] } = await fetchData('generate/tags', {
            method: FetchMethods.POST,
            body: { content },
        });
        return data.tags;
    } catch (error) {
        console.error('Failed to generate tags with AI', error);
        return [];
    }
}

export const generateDescriptionWithAI = async (content: string): Promise<string> => {
    try {
        const data: { description: string } = await fetchData('generate/description', {
            method: FetchMethods.POST,
            body: { content },
        });
        return data.description;
    } catch (error) {
        console.error('Failed to generate description with AI', error);
        return "";
    }
}