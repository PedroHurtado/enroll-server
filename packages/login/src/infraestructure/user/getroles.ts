import { Http } from "@enroll-server/common";
import { config } from "../../config";
export interface Roles{
    userId:string,
    roles:string[]
}
export async function getRoles(userId:string){
    const url = `${config.tenant}/tenant/roles/${userId}` 
    const result = await Http.get<Roles>(url)
    return result
}