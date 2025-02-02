import { Express, Request, Response } from 'express';
import { User } from '../../../infraestructure/user/user';
import { IUser } from '../../../domain/user/user';
import { Add, convertUUID,validate,authorize } from '@enroll-server/common'
import { body } from 'express-validator';


export default function createUserCommand(app: Express) { 

    /*
        * - `req.body`
        * - `req.cookies`
        * - `req.headers`
        * - `req.params`
        * - `req.query`
    */

    const path='/user';

    const validators = [
        body('').notEmpty().withMessage('')
    ]
    const service = async (user:IUser)=>{
        const repository = new Add(User);
        await repository.add(user);    
    };
    const controller = async (req:Request, res:Response)=>{
        const id = convertUUID(crypto.randomUUID());
        const user:IUser = {
            id,            
            emailOrPhone: '616647015'
        }
        await service(user)
        res.send('User created');
    }
    
    app.post(path, authorize(), validate(validators), controller);

}