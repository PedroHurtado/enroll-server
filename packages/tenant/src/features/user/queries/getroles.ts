import { Connection, context, getRequestHeaders, Log } from "@enroll-server/common";
import { Express, Request, Response } from "express";
import { Logger } from "pino";

export default function getRoles(app:Express, logger: Logger){

    app.use(context())

    const path = '/tenant/roles/:userId'

    interface  IResponse{
        userId:string,
        roles:string[]
    }

    class Service {
        
        @Connection<IResponse>("")
        @Log<IResponse>(logger)
        static async  handler(userId:string):Promise<IResponse>{
            return {
                userId,
                roles:["Admin"]
            }
        }
    }

    const controller = async (req:Request, res:Response)=>{        
        const result = await Service.handler(req.params.userId)
        res.json(result)
    }

    app.get(path, controller)
}