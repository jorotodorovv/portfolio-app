import { FetchEndpoints, FetchMethods, request } from "@/lib/api";

type KeywordResponse = { word: string }[];
type SummaryResponse = { summary_text: string }[];

type ModelType = 'keyword' | 'summary';

export async function generate(content: string, type: ModelType): Promise<string[] | string | undefined> {
    try {
        const result: KeywordResponse | SummaryResponse = await request(FetchEndpoints.AI, {
            baseUrl: process.env.NEXT_PUBLIC_AI_API_URL,
            method: FetchMethods.POST,
            body: { content, modelType: type },
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
        });

        return type === 'keyword'
            ? (result as KeywordResponse)?.map(t => t.word)
            : (result as SummaryResponse)[0]?.summary_text;
    } catch (error) {
        console.error(`Failed to generate ${type} with AI`, error);
        return type === 'keyword' ? [] : "";
    }
}

export const generateTags = (content: string) =>
    generate(content, 'keyword') as Promise<string[]>;

export const generateDescription = (content: string) =>
    generate(content, 'summary') as Promise<string>;