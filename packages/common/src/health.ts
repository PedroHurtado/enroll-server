import { Express, Request, Response } from "express";
export function health(app:Express){
    app.get('/health', (_:Request, res:Response)=>{
        res.send('OK')
    })
}