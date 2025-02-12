import { Request, Response, NextFunction } from "express";
import { withRequestHeaders } from "./requestcontext";
export function context() {
    return async function (req: Request, res: Response, next: NextFunction) {

        const headers = {
            'Authorization': req.headers['authorization'] as string || '',
            'x-tenant': req.headers['x-tenant'] as string || '',
        };
        withRequestHeaders(headers, () => {
            next();
            return Promise.resolve();
        }).catch(error => {
            next(error); // Pasamos el error a Express y paramos la ejecución
            return;
        });
    }
} 