import { config } from "@enroll-server/common";

const dev = {
    port:3001,
    name:'tenant',
    bakend:'http://host.docker.internal:3001',
    domains:['*.enroll.com'],
    ...config    
}

export {dev}

