import { getRequestHeaders } from '../requestcontext';
import { ResponseStrategy } from './estrategies';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type HttpHeaders = Record<string, string>;

interface FetchOptions {
    method: HttpMethod;
    headers?: HttpHeaders;
    body?: any;
}
export class Http {
    private static defaultHeaders: HttpHeaders = {
        "accept": "application/json"
    };

    private static getHeaders(headers: HttpHeaders = {}): HttpHeaders {
        return {
            ...getRequestHeaders(),
            ...headers
        };
    }

    private static analyzeFetchBody(body: any): { body: any; headers?: HttpHeaders } {
        if (body === null || body === undefined) {
            return { body: null };
        }

        if (
            body instanceof Blob ||
            body instanceof File ||
            body instanceof FormData ||
            body instanceof URLSearchParams ||
            body instanceof ReadableStream
        ) {
            return { body };
        }

        const headers: HttpHeaders = {};

        if (typeof body === "string") {
            headers["Content-Type"] = "text/plain";
            return { body, headers };
        }

        if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
            headers["Content-Type"] = "application/octet-stream";
            return { body, headers };
        }

        if (typeof body === "object") {
            headers["Content-Type"] = "application/json";
            return { body: JSON.stringify(body), headers };
        }

        throw new Error("Tipo de body no soportado");
    }

    private static async request<T>(
        method: HttpMethod,
        url: string,
        options: Partial<FetchOptions> = {}
    ): Promise<T> {
        const headers = this.getHeaders({
            ...this.defaultHeaders,
            ...options.headers
        });

        let fetchOptions: FetchOptions = {
            method,
            headers
        };

        if (options.body) {
            const { body: requestBody, headers: bodyHeaders } = this.analyzeFetchBody(options.body);
            fetchOptions = {
                ...fetchOptions,
                body: requestBody,
                headers: {
                    ...fetchOptions.headers,
                    ...bodyHeaders
                }
            };
        }

        const response = await fetch(url, fetchOptions);
        const status = response.status.toString() as keyof typeof ResponseStrategy;
        const strategy = ResponseStrategy[status];
        return strategy(response) as T;
    }

    static async get<T>(url: string, headers?: HttpHeaders): Promise<T> {
        return this.request<T>('GET', url, { headers });
    }

    static async post<T>(url: string, body: any, headers?: HttpHeaders): Promise<T> {
        return this.request<T>('POST', url, { body, headers });
    }

    static async put<T>(url: string, body: any, headers?: HttpHeaders): Promise<T> {
        return this.request<T>('PUT', url, { body, headers });
    }

    static async patch<T>(url: string, body: any, headers?: HttpHeaders): Promise<T> {
        return this.request<T>('PATCH', url, { body, headers });
    }

    static async delete<T>(url: string, headers?: HttpHeaders): Promise<T> {
        return this.request<T>('DELETE', url, { headers });
    }
}

