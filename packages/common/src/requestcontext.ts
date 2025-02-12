import { AsyncLocalStorage } from 'async_hooks';

const requestContext = new AsyncLocalStorage<Record<string, string>>();

export function setRequestHeaders(headers: Record<string, string>) {
  requestContext.run(headers, () => {});
}

export function getRequestHeaders(): Record<string, string> {
  return requestContext.getStore() || {};
}


