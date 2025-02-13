import { config } from "@enroll-server/common";

const dev = {
    port:3000,
    name:'login',
    bakend:'http://host.docker.internal:3000',
    domains:['*.enroll.com'],
    tenant:'http://localhost:3001',
    ...config    
}

export {dev}

