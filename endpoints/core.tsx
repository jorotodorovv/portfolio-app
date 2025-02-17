import { getVercelOidcToken } from '@vercel/functions/oidc';

const DEFAULT_CONTNET_TYPE = 'application/json';

export enum FetchMethods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

interface FetchOptions<TBody> {
    method?: FetchMethods;
    body?: TBody;
    callback?: () => void;
    query?: string[];
    contentType?: string;
}

export enum FetchEndpoints {
    POSTS = 'posts',
    COMMENTS = 'comments',
    GENERATE = 'generate',
}

export async function fetchData<T, TBody>(endpoint: string, options: FetchOptions<TBody> = {}): Promise<T> {
    const {
        query,
        body,
        callback,
        method = FetchMethods.GET,
        contentType = DEFAULT_CONTNET_TYPE,
    } = options;

    const baseUrl = process.env.PUBLIC_API_URL || '';

    let url = `${baseUrl}/api/${endpoint}`;

    if (query) {
        url += '/' + query.join('/');
    }

    const fetchOptions: RequestInit = {
        method,
        headers: {
            Authorization: process.env.NODE_ENV !== 'development' ? `Bearer ${await getVercelOidcToken()}` : '',
            'Content-Type': contentType,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    };

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const result = await response.json();

        return result as T;
    } catch (error: any) {
        throw error;
    } finally {
        if (callback) callback();
    }
}