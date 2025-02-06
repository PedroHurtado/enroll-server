import { Logger } from "pino";

export function Log(logger: Logger) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]):Promise<any> {
            console.log("Log decorator")
            return originalMethod.apply(this, args);
        }
    };
}
export function Connection(connection: string) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]):Promise<any> {
            console.log("Connection decorator")
            return originalMethod.apply(this, args);
        }
    };
}