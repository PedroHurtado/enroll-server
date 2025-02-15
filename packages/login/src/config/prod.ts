import { config } from "@enroll-server/common";

const prod = {
    port:3000,
    name:'login',
    bakend:'http://login:3000',
    domains:['*.enroll.com'],
    tenant:'http://tenant:3001',
    messages:'http://messages:3002',
    ...config    
}

export {prod}