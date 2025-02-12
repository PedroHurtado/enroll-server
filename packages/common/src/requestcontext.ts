import { AsyncLocalStorage } from 'async_hooks';

const requestContext = new AsyncLocalStorage<Record<string, string>>();

export function getRequestHeaders(): Record<string, string> {
    return requestContext.getStore() || {};
}

export function withRequestHeaders<T>(
    headers: Record<string, string>, 
    operation: () => T | Promise<T>
): Promise<T> {
    return new Promise((resolve, reject) => {
        requestContext.run(headers, async () => {
            try {
                const result = await operation();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}