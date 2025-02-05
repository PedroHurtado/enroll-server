import { Express,Request,Response } from "express";
import { Logger } from "pino";
import { authorize, DataBaseDecorator,LoggerDecorator, validate } from "@enroll-server/common";
import { ContextRunner } from "express-validator";
export default function get(app: Express, logger:Logger) { 
  

    const validators:ContextRunner[] = []

    class Service{
        @DataBaseDecorator('connection')
        @LoggerDecorator(logger)
        static async handler(){
            console.log('Ejecutando handler...');
        }
    }
    const controller = async (req: Request, res: Response) => {
        await Service.handler();
        res.send('User created');
    }

    app.get('/', authorize,validate(validators), controller);

}
