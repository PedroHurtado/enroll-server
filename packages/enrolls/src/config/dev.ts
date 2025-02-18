import { config } from "@enroll-server/common";

const dev = {
    port:3003,
    name:'login',
    bakend:'http://host.docker.internal:3003',
    domains:['*.enroll.com'],
    ...config    
}

export {dev}

