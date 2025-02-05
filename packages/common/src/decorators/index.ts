import { Logger } from "pino";

export function LoggerDecorator(logger: Logger) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        console.log(`DataBase Decorator applied on: ${String(context.name)}`);
    };
}
export function DataBaseDecorator(connection: string) {
    return (target: any, context: ClassMethodDecoratorContext) => {
        console.log(`DataBase Decorator applied on: ${String(context.name)}`);
    };
}