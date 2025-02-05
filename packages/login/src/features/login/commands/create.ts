import { Express, Request, Response } from 'express';
import { Logger } from 'pino'
import {
    validate,
    authorize,
    Log,
    Connection
} from '@enroll-server/common'
import { body, ContextRunner } from 'express-validator';


export default function create(app: Express, logger: Logger) {
   

    const path = '/login';

    const validators:ContextRunner[] = [        
    ]

    class Service {
        @Connection('connection')
        @Log(logger)
        static async handler() {  
            console.log('Ejecutando handler...');
        }
    }


    const controller = async (req: Request, res: Response) => {
        await Service.handler();
        res.send('User created');
    }

    app.post(path, authorize(), validate(validators), controller);

}