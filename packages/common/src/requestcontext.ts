import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<Record<string, string>>();

export function getRequestHeaders(): Record<string, string> {
    return requestContext.getStore() || {};
}
