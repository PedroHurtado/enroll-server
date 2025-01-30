import { Request, Response,NextFunction } from "express";
export const autorize = (roles:string[]=[])=>{
    return (rea:Request,res:Response,next:NextFunction)=>{
        next()
    }
}