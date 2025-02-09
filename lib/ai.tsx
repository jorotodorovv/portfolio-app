import axios, { AxiosError } from 'axios';

// Define an enum for model types
export enum ModelType {
    SUMMARY = 'summary',
    KEYWORD = 'keyword',
}

interface RetryErrorData {
    error: string;
    estimated_time: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithDelay<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 5000
): Promise<T> {
    try {
        return await fn();
    } catch (error: unknown) {
        if (retries === 0) throw error;

        const retryError = error as AxiosError<RetryErrorData>;

        if (retryError &&
            retryError.response &&
            retryError.response.status === 503 &&
            retryError.response.data?.estimated_time) {
            const waitTime = (retryError.response.data.estimated_time * 1000) + 1000;
            await delay(waitTime);
        }
        else {
            await delay(delayMs);
        }
    }

    return retryWithDelay(fn, retries - 1, delayMs);
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