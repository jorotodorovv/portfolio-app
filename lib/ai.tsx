import axios from 'axios';

// Define an enum for model types
export enum ModelType {
    SUMMARY = 'summary',
    KEYWORD = 'keyword',
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

    try {
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
    } 
    catch (error) {
        console.error('Error calling Hugging Face API:', error);
        throw new Error('AI service failed to generate output');
    }
};