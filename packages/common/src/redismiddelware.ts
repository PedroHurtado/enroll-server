import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

declare module "express" {
    export interface Request {
        tenantId?: string;
    }
}

export const redis = new Redis("redis://localhost:6379");

const gracefulShutdown = async () => {
    console.log("Cerrando conexión con Redis...");
    await redis.quit();
    console.log("Conexión con Redis cerrada.");
    process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);


export function useRedis() {

    return async function (req: Request, res: Response, next: NextFunction) {
        const subdomain = req.hostname.split('.')[0];
        if (!subdomain || subdomain === "example") {
            return res.status(400).json({ error: "Subdominio inválido" });
        }
        const tenantId = await redis.get(`tenant:${subdomain}`);

        if (!tenantId) {
            return res.status(404).json({ error: "Tenant no encontrado" });
        }
        req.tenantId = tenantId;
        next();
    }
}