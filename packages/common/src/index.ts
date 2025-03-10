declare global {
    namespace Express {
        interface Request {
            tenantId: string;
        }
    }
}

export * from './validate'
export * from './authorize'
export * from './registerfeatures'
export * from './entitybase'
export * from './repository/repository'
export * from './logger'
export * from './decorators'
export * from './tenantmiddelware'
export * from './redisconnection'
export * from './registerroutes'
export * from './config'
export * from './requestcontext'
export * from './contextmiddelware'
export * from './httpclient'
export * from './health'
export * from './getkeys'
