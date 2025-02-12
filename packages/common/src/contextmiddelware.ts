import { Request, Response, NextFunction } from "express";
import { setRequestHeaders } from "./requestcontext";
export function context() {
    return function (req: Request, res: Response, next: NextFunction) {
        setRequestHeaders({
            'Authorization': req.headers['Authorization'] as string || '',
            'x-tenant': req.headers['x-tenant'] as string || '',
        });
        next()
    }
} 