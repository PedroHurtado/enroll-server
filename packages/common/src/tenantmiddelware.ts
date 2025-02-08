import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

export function tenat(redis:Redis) {

    return async function (req: Request, res: Response, next: NextFunction) {
        const subdomain = req.headers["x-tenant"];
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