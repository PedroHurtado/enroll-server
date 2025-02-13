import { Request, Response, NextFunction } from "express";
import { requestContext } from "./requestcontext";
export function context() {
    return  function (req: Request, res: Response, next: NextFunction) {

        const headers = {
            'Authorization': req.headers['authorization'] as string || '',
            'x-tenant': req.headers['x-tenant'] as string || '',
        };
        return requestContext.run(headers, next)
    }
} 