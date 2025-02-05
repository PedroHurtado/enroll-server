import { Logger } from "pino";

export function LoggerDecorator(logger: Logger) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]) {
            originalMethod.apply(this, args);
        }
    };
}
export function DataBaseDecorator(connection: string) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        const originalMethod = target;
        return async function(this:any,...args: any[]) {
            originalMethod.apply(this, args);
        }
    };
}