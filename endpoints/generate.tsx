export const generateTagsWithAI = async (content: string) => {
    const response = await fetch('/api/generate/tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    if (response.ok) {
        const data = await response.json();

        return data.tags;
    } else {
        console.error('Failed to generate tags with AI');
        return [];
    }
}

export const generateDescriptionWithAI = async (content: string) => {
    const response = await fetch('/api/generate/description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    if (response.ok) {
        const data = await response.json();

        return data.description;
    } else {
        console.error('Failed to generate description with AI');
        return [];
    }
}