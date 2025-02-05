import { Express,Request,Response } from "express";
import { Logger } from "pino";
import { authorize, Log,Connection, validate } from "@enroll-server/common";
import { ContextRunner } from "express-validator";
export default function get(app: Express, logger:Logger) { 
  

    const path='/'
    
    const validators:ContextRunner[] = []
    
    class Service{
        @Connection('connection')
        @Log(logger)
        static async handler(){
            console.log('Ejecutando handler...');
        }
    }
    const controller = async (req: Request, res: Response) => {
        await Service.handler();
        res.send('User get');
    }    
    app.get(path, authorize(), validate(validators), controller);

}
