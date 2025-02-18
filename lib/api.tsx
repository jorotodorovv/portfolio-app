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
    baseUrl?: string;
    headers?: Record<string, string>;
}

export enum FetchEndpoints {
    POSTS = 'posts',
    COMMENTS = 'comments',
    AI = 'ai',
}

interface RetryErrorData {
    error: string;
    estimated_time: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function request<T, TBody>(endpoint: string, options: FetchOptions<TBody> = {}): Promise<T> {
    const {
        query,
        body,
        callback,
        method = FetchMethods.GET,
        contentType = DEFAULT_CONTNET_TYPE,
        baseUrl = '',
        headers = {},
    } = options;

    let url = baseUrl ? `${baseUrl}/${endpoint}` : `/api/${endpoint}`;

    if (query) {
        url += '/' + query.join('/');
    }

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': contentType,
            ...headers,
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
    } finally {
        if (callback) callback();
    }
}

export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 5000
): Promise<T> {
    try {
        return await fn();
    } catch (error: unknown) {
        if (retries === 0) throw error;

        const retryError = error as {
            response?: {
                status: number;
                data?: RetryErrorData;
            }
        };

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

    return retry(fn, retries - 1, delayMs);
}