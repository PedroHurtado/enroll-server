import { config } from "@enroll-server/common";

const prod = {
    port:3002,
    name:'messages',
    bakend:'http://messages:3002',
    domains:['*.enroll.com'],
    ...config    
}

export {prod}