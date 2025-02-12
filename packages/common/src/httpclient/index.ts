import { getRequestHeaders } from '../requestcontext'

function getHeaders(headers?: Record<string, string>) {
    if (headers) {
        return {
            ...getRequestHeaders(),
            ...headers
        }
    }
    return {
        ...getRequestHeaders()
    }

}

function analyzeFetchBody(body: any): { body: any; headers?: Record<string, string> } {
    const headers: Record<string, string> = {};

    if (body === null || body === undefined) {
        return { body: null };
    }

    if (body instanceof Blob ||
        body instanceof File ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof ReadableStream) {
        return { body };
    }

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


export class HttpGet {
    static get<T>(url: string, headers: Record<string, string> = {
        "accept": "application/json"
    }): Promise<T> {
        return fetch(url, {
            method: 'GET',
            headers: getHeaders(headers)
        }) as Promise<T>
    }
}
export class HttpDelete {
    static delete<T>(url: string): Promise<T> {
        return fetch(url, {
            method: 'GET',
            headers: getHeaders()
        }) as Promise<T>
    }
}
export class HttpPost {
    static post<T>(url: string, body: any, headers: Record<string, string> = {
        "accept": "application/json"
    }): Promise<T> {
        const { body: requestBody,
            headers: requestHeaders } = analyzeFetchBody(body);
        return fetch(url, {
            method: 'POST',
            body: requestBody,
            headers: getHeaders({ ...headers, ...requestHeaders })
        }) as Promise<T>
    }
}

export class HttpPut {
    static put<T>(url: string, body: any, headers: Record<string, string> = {
        "accept": "application/json"
    }): Promise<T> {
        const { body: requestBody,
            headers: requestHeaders } = analyzeFetchBody(body);
        return fetch(url, {
            method: 'POST',
            body: requestBody,
            headers: getHeaders({ ...headers, ...requestHeaders })
        }) as Promise<T>
    }
}

export class HttpPatch {
    static patch<T>(url: string, body: any, headers: Record<string, string> = {
        "accept": "application/json"
    }): Promise<T> {
        const { body: requestBody,
            headers: requestHeaders } = analyzeFetchBody(body);
        return fetch(url, {
            method: 'POST',
            body: requestBody,
            headers: getHeaders({ ...headers, ...requestHeaders })
        }) as Promise<T>
    }
}