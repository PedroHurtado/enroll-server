import { config } from "@enroll-server/common";

const dev = {
    port:3002,
    name:'messages',
    bakend:'http://host.docker.internal:3002',
    domains:['*.enroll.com'],
    ...config    
}

export {dev}

