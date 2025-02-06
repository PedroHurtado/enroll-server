import { Logger } from "pino";

export function Log<T>(logger: Logger) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]):Promise<T> {
            console.log("Log decorator")
            return originalMethod.apply(this, args) as T;
        }
    };
}
export function Connection<T>(connection: string) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]):Promise<T> {
            console.log("Connection decorator")
            return originalMethod.apply(this, args) as T;
        }
    };
}