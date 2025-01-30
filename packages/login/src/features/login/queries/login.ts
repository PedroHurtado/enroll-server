import { Express,Request,Response } from "express";
export default function login(app: Express) { 

    app.get('/', (_:Request, res:Response) => {
        res.send('Hello World');
    });

}
