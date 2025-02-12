import {
    BadRequest,
    NotAllowed,
    Forbidden,
    InternalError,
    NotAutorized,
    NotFound
} from "./customerrors.js";

/**
 * Estrategia única para manejar respuestas HTTP
 */
export const ResponseStrategy = {
    "200": async (res: Response) => await parseResponse(res),
    "201": async (res: Response) => await parseResponse(res),
    "204": async (_: Response) => "",

    "400": async (res: Response) => { 
        const data = await res.json();
        throw new BadRequest(data);
    },
    "401": async (_: Response) => { throw new NotAutorized(); },
    "403": async (_: Response) => { throw new Forbidden(); },
    "404": async (_: Response) => { throw new NotFound(); },
    "405": async (_: Response) => { throw new NotAllowed(); },
    "500": async (res: Response) => { 
        const data = await res.json();
        throw new InternalError(data);
    },
};


export async function parseResponse(res: Response) {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return await res.json()
    } 
    if (contentType.includes("text/plain")) {
        return await res.text();
    } 
    if (contentType.includes("application/octet-stream")) {
        return await res.arrayBuffer();
    } 
    if (contentType.includes("image/") || contentType.includes("application/pdf")) {
        return await res.blob();
    }

    return res; // Si no sabemos qué es, devolvemos Response sin procesar
}
