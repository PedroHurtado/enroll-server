import { redis } from "@enroll-server/common";
import { IOtp } from "../../domain/user/otp";


export async function setOtp( otp:IOtp):Promise<void> {
    const key=`otp:${otp.id}`    
    await redis.set(key, JSON.stringify(otp), 'EX', otp.expiresAt - otp.createdAt);
}