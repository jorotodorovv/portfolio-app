import { FetchMethods, request, retry } from "@/lib/api";

export enum ModelType {
    SUMMARY = 'summary',
    KEYWORD = 'keyword',
}

export async function generateOutput<T>(content: string, modelType: ModelType) {
    let model: string | undefined;

    switch (modelType) {
        case ModelType.SUMMARY:
            model = process.env.AI_SUMMARY_MODEL;
            break;
        case ModelType.KEYWORD:
            model = process.env.AI_KEYWORD_MODEL;
            break;
        default:
            throw new Error('Invalid model type');
    }

    return retry(async () => {
        const result = await request<T, { inputs: string }>(
            `models/${model}`,
            {
                method: FetchMethods.POST,
                body: { inputs: content },
                contentType: 'application/json',
                baseUrl: 'https://api-inference.huggingface.co',
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                }
            }
        );

        return result;
    });
};