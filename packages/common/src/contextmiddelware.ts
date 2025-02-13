import { Request, Response, NextFunction } from "express";
import { requestContext } from "./requestcontext";
export function context() {
    return async function (req: Request, res: Response, next: NextFunction) {

        const headers = {
            'Authorization': req.headers['authorization'] as string || '',
            'x-tenant': req.headers['x-tenant'] as string || '',
        };
        requestContext.run(headers, ()=>{
            next()
        })
    }
} 