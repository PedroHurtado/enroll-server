import { Express, Request, Response } from 'express';
import { Logger } from 'pino'
import {
    validate,
    authorize,
    Log,
    Connection
} from '@enroll-server/common'

import { body, ContextRunner } from 'express-validator';
import { OTPGenerator } from '../../../domain/user/otpService';
import { setOtp } from '../../../infraestructure/user/otpsession';
import { IOtp } from 'packages/login/src/domain/user/otp';

export default function create(app: Express, logger: Logger) {


    interface IRequest {
        emailOrPhone: string,
        tenantId?: string
    }
    interface IResponse {
        id: string,
        otp: string
    }
    const path = '/login';

    const validators: ContextRunner[] = [
    ]

    class Service {
        @Connection('connection')
        @Log(logger)
        static async handler(request: IRequest): Promise<any> {
            const result = OTPGenerator.generateOTP()
            const otp: IOtp = {
                id: crypto.randomUUID(),
                tenantId: request.tenantId,
                emailOrPhone: request.emailOrPhone,
                ...result
            }
            setOtp(otp)
            return {
                id: otp.id,
                otp: otp.otp
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

    app.post(path, authorize(), validate(validators), controller);

}