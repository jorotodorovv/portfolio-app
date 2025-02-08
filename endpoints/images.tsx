// Helper function to check if a string is a URL
export function isUrl(str: string) {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}

// Implement this function to upload the image and return the new URL
export async function uploadImage(imagePath: string): Promise<string> {
    // 1. Read the image file (assuming it's a local path)
    const response = await fetch(imagePath);
    
    if (!response.ok) {
        throw new Error(`Image upload failed: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${blob.type.split('/')[1]}`;

    // 2. Create a FormData object
    const formData = new FormData();
    formData.append('image', blob, filename); // Replace 'image.png' with a more descriptive filename

    // 3. Upload to your image storage service (replace with your actual endpoint)
    const uploadResponse = await fetch('/api/upload/image', { // Example API endpoint
        method: 'POST',
        body: formData,
    });

    if (!uploadResponse.ok) {
        throw new Error(`Image upload failed: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    
    return uploadData.imageUrl; // Assuming your API returns the new image URL in this format
}