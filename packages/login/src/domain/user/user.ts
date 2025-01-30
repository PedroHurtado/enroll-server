import {IEntity} from '@enroll-server/common'

export interface IUser extends IEntity {
    emailOrPhone: string;
}