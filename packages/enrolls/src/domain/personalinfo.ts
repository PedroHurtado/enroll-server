import { IEntity } from "@enroll-server/common";

export interface IPersonalInfo extends IEntity {
    email:string;
    phone:string;
}