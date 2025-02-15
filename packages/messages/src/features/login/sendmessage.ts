import { context } from "@enroll-server/common";
import { Express, Request, Response } from "express";
import { Logger } from "pino";

export default function sendMessage(app:Express, logger:Logger){
    const path='/login/messages'

    interface IRequest{
        userOrPhone:string,
        tenantId:string,
        otp:string
    }
    class Service{
        static async handler(req:IRequest){
            console.log(req.otp)
        }
    }
    const controller = async (req: Request, res: Response) => {        
        const data:IRequest = {
            userOrPhone: req.body.userOrPhone,
            tenantId:req.tenantId,
            otp:req.body.otp
        }
        Service.handler(data)
        res.status(201).end()
    }
    
    app.post(path, context(), controller)
    
}