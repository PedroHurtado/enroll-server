import { Express, Request, Response } from 'express';
import { Logger } from 'pino'
import {
    Log,
    Connection,      
    context,
    authorize,
    validate
} from '@enroll-server/common'

import { ContextRunner } from 'express-validator';
import { OTPGenerator } from '../../../domain/otp/otpservice';
import { IOtp } from '../../../domain/otp/otp';
import { setOtp } from '../../../infraestructure/otp/otpsession';
import { getRoles } from 'packages/login/src/infraestructure/user/getroles';
import { sendMessages } from '../../../infraestructure/messages/sendmessage';

export default function login(app: Express, logger: Logger) {
    
    
    interface IRequest {
        emailOrPhone: string,
        tenantId?: string
    }
    interface IResponse {
        id: string,       
    }
    const path = '/login';

    const validators: ContextRunner[] = [
    ]

    class Service {
        @Connection<IResponse>('connection')
        @Log<IResponse>(logger)
        static async handler(request: IRequest): Promise<IResponse> {
            const result = OTPGenerator.generateOTP()
            
            const {roles} = await getRoles(request.emailOrPhone)
            
            const otp: IOtp = {
                id: crypto.randomUUID(),
                tenantId: request.tenantId,
                emailOrPhone: request.emailOrPhone,
                roles,
                ...result
            }            
            setOtp(otp)
            
            await sendMessages({
                emailOrPhone:request.emailOrPhone,
                otp:otp.otp
            });

            return {
                id: otp.id               
            }
        }
    }


    const controller = async (req: Request, res: Response) => {        
        const request: IRequest = {
            emailOrPhone: req.body.emailOrPhone,
            tenantId: req.tenantId
        }
        const response = await Service.handler(request);
        res.json(response)
    }

    app.post(path, authorize(), validate(validators), context(), controller);

}