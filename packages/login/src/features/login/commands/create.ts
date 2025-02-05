import { Express, Request, Response } from 'express';
import { Logger } from 'pino'
import {
    validate,
    authorize,
    LoggerDecorator,
    DataBaseDecorator
} from '@enroll-server/common'
import { body } from 'express-validator';


export default function create(app: Express, logger: Logger) {

    /*
        * - `req.body`
        * - `req.cookies`
        * - `req.headers`
        * - `req.params`
        * - `req.query`
    */

    const path = '/user';

    const validators = [
        body('').notEmpty().withMessage('')
    ]

    class Service {
        @DataBaseDecorator('connection')
        @LoggerDecorator(logger)
        static async handler() {  // Aquí añadimos static
            console.log('Ejecutando handler...');
        }
    }


    const controller = async (req: Request, res: Response) => {
        await Service.handler();
        res.send('User created');
    }

    app.post(path, authorize(), validate(validators), controller);

}