import { model, Schema } from "mongoose";
import { BaseEntitySchema } from "@enroll-server/common";
import { IUser } from "../../domain/user/user";


const schema = new Schema<IUser>({
    ...BaseEntitySchema,
    emailOrPhone: { type: String, required: true }
}, {
    versionKey: false
})

export const User = model<IUser>('User', schema);