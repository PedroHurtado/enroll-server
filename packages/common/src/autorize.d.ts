import { Request, Response, NextFunction } from "express";
export declare const autorize: (roles?: string[]) => (rea: Request, res: Response, next: NextFunction) => void;
