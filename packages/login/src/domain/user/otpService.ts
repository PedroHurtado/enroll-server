export interface OTPData {
    otp: string;
    createdAt: number;
    expiresAt: number;
}

export class OTPGenerator {
    private static  readonly defaultLength: number = 6;
    private static readonly defaultExpiryTime: number = 300; // 5 minutes in seconds


    public static generateOTP(
        length: number = OTPGenerator.defaultLength, 
        expiryTime: number = OTPGenerator.defaultExpiryTime): OTPData {
        if (length < 1) throw new Error('OTP length must be positive');
        if (expiryTime < 1) throw new Error('Expiry time must be positive');

        const maxValue: number = Math.pow(10, length) - 1;
        const minValue: number = Math.pow(10, length - 1);
        const range: number = maxValue - minValue + 1;


        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const randomNumber = array[0];
        const otp = (randomNumber % range) + minValue;

        const currentTime: number = Math.floor(Date.now() / 1000);

        return {
            otp: otp.toString().padStart(length, '0'),
            createdAt: currentTime,
            expiresAt: currentTime + expiryTime
        };
    }


    public static verifyOTP(storedOTPData: OTPData, inputOTP: string): boolean {
        const currentTime: number = Math.floor(Date.now() / 1000);
        return currentTime <= storedOTPData.expiresAt && inputOTP === storedOTPData.otp;
    }


}
