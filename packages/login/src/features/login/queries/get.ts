import { Express,Request,Response } from "express";
export default function get(app: Express) { 

    app.get('/', (_:Request, res:Response) => {
        res.send('Hello World');
    });

}
