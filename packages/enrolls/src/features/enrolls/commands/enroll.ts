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
import { IEnroll } from '../../../domain/enroll';

export default function createEnroll(app: Express, logger: Logger) {
    interface IRequest {
        enroll: IEnroll,
    }
    interface IResponse {
    }
    const path = '/enrolls'

    const validators: ContextRunner[] = [
        // TODO: Validate request
    ]

    class Service {
        @Log<IResponse>(logger)
        static async handler(request: IRequest): Promise<IResponse> {
            return { result: "Test response"}
        }
    }

    const controller = async (req: Request, res: Response) => {
        const request: IRequest = {
            enroll: req.body.enroll,
        }
        const response = await Service.handler(request);
        res.status(201).json(response)
    }

    app.post(path, authorize(), validate(validators), context(), controller);

}