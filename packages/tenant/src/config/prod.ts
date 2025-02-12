import { config } from "@enroll-server/common";

const prod = {
    port:3001,
    name:'tenant',
    bakend:'http://tenant:3001',
    domains:['*.enroll.com'],
    ...config    
}

export {prod}