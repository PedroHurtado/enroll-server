import { Request, Response,NextFunction } from "express";
export const authorize = (roles:string[]=[])=>{
    return (rea:Request,res:Response,next:NextFunction)=>{
        next();
    }
}