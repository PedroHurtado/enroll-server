import { OTPData } from "./otpservice";

export interface IOtp  extends OTPData{
    id:string,
    tenantId?:string,
    emailOrPhone:string   
}