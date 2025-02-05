import { Express,Request,Response } from "express";
import { Logger } from "pino";
export default function get(app: Express, logger:Logger) { 

    app.get('/', (_:Request, res:Response) => {
        res.send('Hello World');
    });

}
