import { config } from "@enroll-server/common";

const prod = {
    port:3003,
    name:'login',
    bakend:'http://enrolls:3000',
    domains:['*.enroll.com'],
    ...config    
}

export {prod}