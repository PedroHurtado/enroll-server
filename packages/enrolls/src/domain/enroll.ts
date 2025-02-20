import { IEntity } from "@enroll-server/common";
import { Identity, Situation, CustodyPA } from "./enroll_enums"
import { IPersonalInfo } from "./personalinfo"

export interface IEnroll extends IEntity {
    identity: Identity;
    situation: Situation;
    custody: CustodyPA;
    parentalAuthority: CustodyPA;
    student: IPersonalInfo;
    mother: IPersonalInfo;
    father: IPersonalInfo;
    guardian: IPersonalInfo;
}

