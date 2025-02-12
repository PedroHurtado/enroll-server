import { config } from "@enroll-server/common";

const prod = {
    port:3000,
    name:'login',
    bakend:'http://login:3000',
    domains:['*.enroll.com'],
    ...config    
}

export {prod}