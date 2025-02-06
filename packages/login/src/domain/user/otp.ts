import { OTPData } from "./otpService";

export interface IOtp  extends OTPData{
    id:string,
    tenantId?:string,
    emailOrPhone:string   
}