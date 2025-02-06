import { redis } from "@enroll-server/common";
import { IOtp } from "../../domain/user/otp";

const getKey = ({ id }: { id: string }) => {
    return `otp:${id}`;
}

export async function setOtp( otp:IOtp):Promise<void> {    
    await redis.set(getKey(otp), JSON.stringify(otp), 'EX', otp.expiresAt - otp.createdAt);
}