import { Request, Response, NextFunction } from 'express';
import { ContextRunner } from 'express-validator';
export declare const validate: (validations: ContextRunner[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
