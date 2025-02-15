import { Http } from "@enroll-server/common";
import { config } from "../../config";

export interface IMessage{
    emailOrPhone:string,
    otp:string
}
export function sendMessages(message:IMessage){
    const url = `${config.messages}/login/messages`
    return Http.post<void>(url,message)
}