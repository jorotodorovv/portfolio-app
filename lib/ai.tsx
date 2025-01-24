import axios from 'axios';

// Define an enum for model types
export enum ModelType {
    SUMMARY = 'summary',
    KEYWORD = 'keyword',
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithDelay<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 2000
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (retries === 0) throw error;
        
        if (error?.response?.status === 503 && error?.response?.data?.estimated_time) {
            // Wait for the estimated time plus a small buffer
            const waitTime = (error.response.data.estimated_time * 1000) + 1000;
            await delay(waitTime);
        } else {
            await delay(delayMs);
        }
        
        return retryWithDelay(fn, retries - 1, delayMs);
    }
}

// Update the generateOutput function to accept a model type
export const generateOutput = async (content: string, modelType: ModelType) => {
    let model: string | undefined;

    // Use a switch case to determine the model based on modelType
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

    return retryWithDelay(async () => {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs: content },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                },
            }
        );

        return response.data;
    });
};